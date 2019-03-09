(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{139:function(e,t,s){"use strict";s.r(t);var a=s(1),n=s.n(a),i=s(6),c=s.n(i),o=(s(81),s(35)),r=s(36),p=s(39),l=s(37),h=s(40),d=s(73),u=s(74),f=(s(82),500),m=function(e,t,s){return e*t*((a=s)/function e(t,s){return s?e(s,t%s):t}(f,a))+1;var a},g=function(e){function t(e){var s;Object(o.a)(this,t),s=Object(p.a)(this,Object(l.a)(t).call(this,e));var a=360/(e.secXlap*e.fps)*(Math.PI/180);return s.state={points:[],d:[],angleSpirograph:0,angleDisc:0,containerCenter:f,anglexStep:a,discCenter:f-s.props.discRadio,angleDiscXstep:a*f/s.props.discRadio,persistence:s.props.stopAtTheEnd?m(e.secXlap,e.fps,f,e.discRadio):s.props.persistence,stop:!1},s}return Object(h.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.frame()}},{key:"componentDidUpdate",value:function(e){var t=this,s={};if(e.discRadio!==this.props.discRadio){var a=this.props.discRadio;s.discCenter=f-a,s.angleDiscXstep=this.state.anglexStep*f/a}if(this.props.secXlap!==e.secXlap||this.props.fps!==e.fps){var n=360/(this.props.secXlap*this.props.fps)*(Math.PI/180);s.anglexStep=n,s.angleDiscXstep=n*f/this.props.discRadio}if(this.props.stopAtTheEnd===e.stopAtTheEnd&&this.props.holeDistance===e.holeDistance||(s.persistence=!0),Object.keys(s).length>0){s.persistence=this.props.stopAtTheEnd?m(this.props.secXlap,this.props.fps,this.props.discRadio,f):this.props.persistence,s.stop=!1;var i=this.state.stop?function(){t.frame()}:null;this.setState(Object(u.a)({},s),i)}}},{key:"addPoint",value:function(e){var t=this.state.points.slice(),s=this.state.d.slice();switch(t.length>this.props.persistence&&(t.shift(),t.shift(),s.shift(),s.shift()),t.push(e),s[0]="M ".concat(t[0].x,",").concat(t[0].y," "),this.props.parametrization){case 2:s.push("L ".concat(e.x,",").concat(e.y," "));break;case 3:var a=2*t[t.length-2].x-.5*e.x-.5*t[t.length-3].x,n=2*t[t.length-2].y-.5*e.y-.5*t[t.length-3].y;s.push("Q ".concat(a,",").concat(n," ").concat(e.x,",").concat(e.y," "))}this.setState({points:t,d:s})}},{key:"frame",value:function(){var e=this,t=this.state,s=t.angleSpirograph,a=t.containerCenter,n=t.discCenter,i=t.angleDisc,c=t.angleDiscXstep,o=t.anglexStep,r=this.props.holeDistance,p=a+Math.cos(s)*n,l=a-Math.sin(s)*n,h=p+Math.cos(-i)*r,d=l-Math.sin(-i)*r;this.addPoint({x:Math.floor(h),y:Math.floor(d)}),this.setState({angleSpirograph:s+o,angleDisc:i+c},function(){var t=!0;if(e.props.stopAtTheEnd&&e.state.points.length===e.state.persistence){var s=e.state.points[0],a=e.state.points[e.state.points.length-1];s.x===a.x&&s.y===a.y&&(t=!1)}t?setTimeout(function(){e.frame()},1e3/e.props.fps):e.setState({stop:!0})})}},{key:"render",value:function(){return n.a.createElement("div",{className:"spirograph"},this.state.d?n.a.createElement("svg",{viewBox:"0 0 ".concat(2*f," ").concat(2*f)},n.a.createElement("path",{d:this.state.d.join(),fill:"transparent",strokeWidth:"2px",stroke:"red",strokeLinejoin:"round",strokeLinecap:"round"})):null)}}]),t}(n.a.Component),v=s(21),x=s(38),E=(s(138),v.a.Handle),k=function(e){var t=e.value,s=e.dragging,a=e.index,i=Object(d.a)(e,["value","dragging","index"]);return n.a.createElement(x.a,{prefixCls:"rc-slider-tooltip",overlay:t,visible:s,placement:"top",key:a},n.a.createElement(E,Object.assign({value:t},i)))},D=function(e){function t(e){var s;return Object(o.a)(this,t),(s=Object(p.a)(this,Object(l.a)(t).call(this,e))).state={discRadio:74,holeDistance:74,persistence:1e3,secXlap:1,fps:60,parametrization:2,persistenceMarks:{10:1,100:2,1000:"\u221e"},persistenceMax:100},s}return Object(h.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.getMaxPointsLabel()}},{key:"changeDiscRadio",value:function(e){var t=this;this.state.holeDistance>e&&this.changeHoleDistance(e),this.setState({discRadio:e},function(){return t.getMaxPointsLabel()})}},{key:"changeHoleDistance",value:function(e){this.setState({holeDistance:e})}},{key:"getMaxPointsLabel",value:function(){for(var e=m(this.state.secXlap,this.state.fps,this.state.discRadio),t={},s=10,a=1;s<e;s*=10,a++)t[s]=a;t[e]="\u221e";var n=this.state.persistence>e?e:this.state.persistence;this.setState({persistenceMarks:t,persistenceMax:e,persistence:n})}},{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"control-panel"},n.a.createElement("div",null,"Disc Radio: ",this.state.discRadio,n.a.createElement(v.a,{defaultValue:this.state.discRadio,min:1,max:500,handle:k,onAfterChange:function(t){return e.changeDiscRadio(t)}})),n.a.createElement("div",null,"Hole distance: ",this.state.holeDistance,n.a.createElement(v.a,{defaultValue:this.state.holeDistance,min:0,max:this.state.discRadio,handle:k,onAfterChange:function(t){return e.changeHoleDistance(t)}})),n.a.createElement("div",null,"Fps: ",this.state.fps,n.a.createElement(v.a,{defaultValue:this.state.fps,min:1,max:60,onAfterChange:function(t){return e.setState({fps:t},function(){return e.getMaxPointsLabel()})},handle:k})),n.a.createElement("div",null,"Seconds per lap: ",this.state.secXlap,n.a.createElement(v.a,{defaultValue:this.state.secXlap,min:.1,max:6,step:.1,handle:k,onAfterChange:function(t){return e.setState({secXlap:t},function(){return e.getMaxPointsLabel()})}})),n.a.createElement("div",null,"Persistence: ",this.state.persistence,n.a.createElement(v.a,{defaultValue:this.state.persistence,min:1,max:this.state.persistenceMax,marks:this.state.persistenceMarks,step:null,handle:k,onAfterChange:function(t){return e.setState({persistence:t})}}))),n.a.createElement("div",{className:"spirograph-container"},n.a.createElement(g,{discRadio:this.state.discRadio,holeDistance:this.state.holeDistance,persistence:this.state.persistence,stopAtTheEnd:"\u221e"===this.state.persistenceMarks[this.state.persistence],fps:this.state.fps,secXlap:this.state.secXlap,parametrization:this.state.parametrization})))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(n.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},75:function(e,t,s){e.exports=s(139)},81:function(e,t,s){},82:function(e,t,s){}},[[75,1,2]]]);
//# sourceMappingURL=main.d13b28cd.chunk.js.map