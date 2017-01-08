import Inferno from 'inferno';
import './index.css';

//our functional lib
const trace = x => y => {console.log(x, y); return y};
const id = x => x;
const apply = (x, y) => x(y);
const applyR = (x, y) => y(x);
const applyRC = x => y => y(x);
const multiApply = (...rest) => x => rest.map(applyRC(x));
const pipe = (...rest) => x => rest.reduce(applyR, x);
const compose = (...rest) => pipe(...rest.reverse());

//app state
const state = {v: 0};

//using closure to make presentState a datastore 
const presentState = state => x => x < 40 ? (state.v < x ? state = {v: x} : state) : state = {v: 999};

const present = presentState(state);

const action = app => x => app(x);

//Inferno element
const view = dispatch => status => (
  <div>
    <button onClick={() => action(app)(status.v + 1)}>+</button>
    {status.v}  
  </div>
);

const renderer = x => y => Inferno.render(y, x);

//rendering function for inferno
const render = renderer(document.getElementById('app'));

const nap = a => s => s.v === 20 ? action(a)(30) : ''; 

const appIO = multiApply(compose(render, view(app)), nap(app));

//app has to hoist in order to behave properly when applied to curried na in appIO

function app(act) {appIO(present(act))}

app(3);
