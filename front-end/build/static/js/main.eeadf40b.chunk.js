(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{24:function(e,t,n){e.exports=n(38)},30:function(e,t,n){},32:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){"use strict";n.r(t);var a,r=n(0),o=n.n(r),i=n(20),s=n.n(i),c=(n(29),n(30),n(14)),l=n.n(c),u=n(21),p=n(1),h=n(2),d=n(4),m=n(3),g=n(5),f=n(11),b=n(8);n(32);function v(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2?arguments[2]:void 0,a=arguments.length>3?arguments[3]:void 0,r=arguments.length>4?arguments[4]:void 0;fetch(n,{method:"POST",body:JSON.stringify({query:e}),headers:{Authorization:t?"Bearer ".concat(t):"","Content-Type":"application/json"},mode:"cors"}).then(function(e){return e.json()}).then(function(e){if(e.errors){var t=e.errors.reduce(function(e,t){return e+" "+t.message},"");r(t)}else a(e)}).catch(function(e){console.log(e)})}!function(e){e.LoadingData="LOADING_DATA",e.ChoosingDialog="CHOOSING_DIALOG",e.ChoosingRole="CHOOSING_ROLE",e.PracticingLines="PRACTICING_LINES",e.DialogComplete="DIALOG_COMPLETE"}(a||(a={}));var E,O=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={errorMessage:"",dialogs:[]},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.context.data;v("\n      query {\n          dialogs {\n            name\n            id\n          }\n      }\n    ",t.token,t.apiEndpoint,function(t){e.setState({dialogs:t.data.dialogs})},function(t){e.setState({errorMessage:t})})}},{key:"render",value:function(){var e=this;return o.a.createElement("div",null,o.a.createElement("h1",null,"The Dialog List Page"),o.a.createElement("ul",null,this.state.dialogs.map(function(t){return o.a.createElement("li",{key:t.id},o.a.createElement(f.b,{to:"".concat(e.props.match.url,"/").concat(t.id,"/choose-role")},t.name))})))}}]),t}(o.a.Component),S=n(10),j={data:{token:"",apiEndpoint:"",chosenRole:{id:"",name:""},speechRecognition:null},actions:{setUserData:function(e){},setChosenRole:function(e){}}},y=o.a.createContext(j),R=y.Consumer,C=function(e){function t(e){var n;Object(p.a)(this,t),(n=Object(d.a)(this,Object(m.a)(t).call(this,e))).setUserData=function(e){n.setState({token:e})},n.setChosenRole=function(e){n.setState({chosenRole:e})};var a=j.data;return a.apiEndpoint="https://enthousiaste-livre-99440.herokuapp.com/",a.speechRecognition=e.speechRecognition,n.state=a,n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return o.a.createElement(y.Provider,{value:{data:this.state,actions:{setUserData:this.setUserData,setChosenRole:this.setChosenRole}}},this.props.children)}}]),t}(o.a.Component),L=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={email:"",password:"",errorMessage:""},n.handleSubmit=function(e,t){e.preventDefault();var a=t.actions,r=n.state,o=r.email,i=r.password,s='\n      mutation {\n          login(email: "'.concat(o,'", password: "').concat(i,'") {\n            token\n          }\n      }\n    ');fetch("https://enthousiaste-livre-99440.herokuapp.com/",{method:"POST",body:JSON.stringify({query:s}),headers:{"Content-Type":"application/json"},mode:"cors"}).then(function(e){return e.json()}).then(function(e){if(e.errors){var t=e.errors.reduce(function(e,t){return e+" "+t.message},"");n.setState({errorMessage:t})}else{var r=e.data.login.token;a.setUserData(r)}console.log(e)}).catch(function(e){console.log(e)})},n.handleInputChange=function(e){n.setState(Object(S.a)({},e.target.id,e.target.value))},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement(R,null,function(t){return o.a.createElement("div",null,o.a.createElement("h1",null,"The Login / Signup Page"),o.a.createElement("form",{className:"auth-form",onSubmit:function(n){return e.handleSubmit(n,t)}},o.a.createElement("div",{className:"form-control"},o.a.createElement("label",{htmlFor:"email"},"Email"),o.a.createElement("input",{id:"email",type:"email",onChange:e.handleInputChange})),o.a.createElement("div",{className:"form-control"},o.a.createElement("label",{htmlFor:"password"},"Password"),o.a.createElement("input",{id:"password",type:"password",onChange:e.handleInputChange})),o.a.createElement("div",{className:"form-actions"},o.a.createElement("button",{type:"button"},"Switch to Signup"),o.a.createElement("button",{type:"submit"},"Submit")),e.state.errorMessage?o.a.createElement("p",null,e.state.errorMessage):null))})}}]),t}(o.a.Component),k=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={possibleRoles:[],chosenRole:{id:"",name:""},errorMessage:""},n.handleChange=function(e){var t=e.target.selectedOptions[0];n.setState({chosenRole:{id:t.value,name:t.text}})},n.handleSubmit=function(e){e.preventDefault(),n.props.context.actions.setChosenRole(n.state.chosenRole);var t=n.props.match.url.replace("choose-role","practice");n.props.history.push(t)},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.context.data,n=this.props.match.params.dialogId;v('\n      query {\n        dialog(id: "'.concat(n,'") {\n          name\n          lines {\n            role {\n              id\n              name\n            }\n          }\n        }\n      }\n    '),t.token,t.apiEndpoint,function(t){var n=t.data.dialog.lines.reduce(function(e,t){return e.find(function(e){return t.role.id===e.id})||e.push(t.role),e},[]);e.setState({possibleRoles:n,chosenRole:n[0]})},function(t){e.setState({errorMessage:t})})}},{key:"render",value:function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement("form",{"data-testid":"role-picker",onSubmit:this.handleSubmit},o.a.createElement("h2",null,"Role Picker"),o.a.createElement("label",{htmlFor:"role-picker__select"},"Available Roles"),o.a.createElement("select",{name:"role",id:"role-picker__select","data-testid":"role-picker__select",value:this.state.chosenRole.id,onChange:this.handleChange},this.state.possibleRoles.map(function(e,t){return o.a.createElement("option",{key:t,value:e.id},e.name)})),o.a.createElement("input",{type:"submit","data-testid":"role-picker__submit",value:"Confirm Role Selection"})),this.state.errorMessage?o.a.createElement("p",null,this.state.errorMessage):null)}}]),t}(o.a.Component),x=function(e){function t(){return Object(p.a)(this,t),Object(d.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement(R,null,function(t){return o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,"The Choose Role Page"),o.a.createElement(k,{history:e.props.history,match:e.props.match,context:t}))})}}]),t}(o.a.Component),I=n(12),D=function(e){function t(){return Object(p.a)(this,t),Object(d.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return o.a.createElement("li",{"data-testid":"line"},o.a.createElement("span",null,this.props.role.name),this.props.guess?o.a.createElement("div",null,"Guess: ",this.props.guess):null,o.a.createElement("div",null,"Line text: ",this.props.text))}}]),t}(o.a.Component),N=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement("ul",{"data-testid":"lines"},this.props.dialog.lines.filter(function(t){return t.number<=e.props.lastLineToDisplay}).map(function(e){return o.a.createElement(D,{key:e.number,text:e.text,guess:e.guess,role:e.role})}))}}]),t}(o.a.Component);n(37);!function(e){e.Started="Started",e.Stopped="Stopped"}(E||(E={}));var w=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).handleToggleSpeechInput=function(e){e.preventDefault(),n.props.updateSpeechRecognitionState()},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return o.a.createElement("button",{onClick:this.handleToggleSpeechInput},this.props.speechRecognitionState===E.Stopped?"Start Speech Input":"Stop Speech Input")}}]),t}(o.a.Component),_=function(e){function t(){var e,n;Object(p.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={guess:"",speechRecognitionState:E.Stopped},n.handleInputChange=function(e){n.setState({guess:e.target.value})},n.handleSubmit=function(e){e.preventDefault(),n.props.speechRecognition.stop(),n.props.addLineGuessToLastLine(n.state.guess),n.setState({guess:"",speechRecognitionState:E.Stopped})},n.updateSpeechRecognitionState=function(){n.state.speechRecognitionState===E.Stopped?(n.props.speechRecognition.start(),n.setState({speechRecognitionState:E.Started})):(n.props.speechRecognition.stop(),n.setState({speechRecognitionState:E.Stopped}))},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.speechRecognition.onresult=function(t){for(var n=t.results,a="",r=0;r<n.length;r++)a+=n[r][0].transcript;e.setState({guess:a})}}},{key:"render",value:function(){return o.a.createElement("form",{"data-testid":"line-guess",onSubmit:this.handleSubmit},o.a.createElement("label",{htmlFor:"line-guess__text-input","data-testid":"line-guess__label"},"Line Guess"),o.a.createElement("input",{className:"line-guess__text-input","data-testid":"line-guess__text-input",id:"line-guess__text-input",onChange:this.handleInputChange,placeholder:"Text of the next line for ".concat(this.props.userRole.name),type:"text",value:this.state.guess}),o.a.createElement(w,{updateSpeechRecognitionState:this.updateSpeechRecognitionState,speechRecognitionState:this.state.speechRecognitionState}),o.a.createElement("input",{type:"submit","data-testid":"line-guess__submit",value:"Submit Guess"}))}}]),t}(o.a.Component),T=function(e){function t(){var e,n;Object(p.a)(this,t);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(o)))).state={userLineNumberIndex:0,userLineNumbers:[],dialog:{id:"",name:"",lines:[]},errorMessage:"",mode:a.PracticingLines},n.addGuessToCurrentLineAndIncrementLineNumber=function(e){n.setState(function(t){var n,r,o,i;return n=t.userLineNumbers[t.userLineNumberIndex],(i=Object(I.a)({},t.dialog)).lines[n].guess=e,(r=t.userLineNumberIndex+1)<t.userLineNumbers.length?(o=a.PracticingLines,Object(I.a)({},t,{dialog:i,userLineNumberIndex:r,mode:o})):(o=a.DialogComplete,Object(I.a)({},t,{dialog:i,userLineNumberIndex:t.userLineNumbers.length-1,mode:o}))})},n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.context.data,n=this.props.match.params.dialogId;v('\n      query {\n        dialog(id: "'.concat(n,'") {\n          name\n          lines {\n            text\n            guess\n            number\n            role {\n              id\n              name\n            }\n          }\n        }\n      }\n    '),t.token,t.apiEndpoint,function(n){var a=n.data.dialog,r=e.calculateUserLineNumbers(a,t.chosenRole);e.setState({dialog:a,userLineNumbers:r})},function(t){e.setState({errorMessage:t})})}},{key:"calculateUserLineNumbers",value:function(e,t){return e.lines.filter(function(e){return e.role.id===t.id}).map(function(e){return e.number})}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement(R,null,function(t){var n=e.state,r=n.userLineNumbers,i=n.userLineNumberIndex,s=0;switch(r.length>0&&(s=r[i]),e.state.mode){case a.PracticingLines:return o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,"The Practice Page"),o.a.createElement(N,{dialog:e.state.dialog,lastLineToDisplay:s-1}),o.a.createElement(_,{userRole:t.data.chosenRole,addLineGuessToLastLine:e.addGuessToCurrentLineAndIncrementLineNumber,speechRecognition:t.data.speechRecognition}));case a.DialogComplete:return o.a.createElement(N,{dialog:e.state.dialog,lastLineToDisplay:e.state.dialog.lines.length-1})}}),this.state.errorMessage?o.a.createElement("p",null,this.state.errorMessage):null)}}]),t}(o.a.Component),M=function(e){function t(){var e,n;Object(p.a)(this,t);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return(n=Object(d.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(o)))).state={dialogs:[],currentDialog:{id:"random",name:"",lines:[]},numberOfLinesInDialog:0,userRoleLineIndex:0,userRole:"",userRoleLineNumbers:[],mode:a.LoadingData},n.setUserRoleAndChangeMode=function(){var e=Object(u.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n}return Object(g.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){return o.a.createElement(C,{speechRecognition:this.props.speechRecognition},o.a.createElement(f.a,null,o.a.createElement(R,null,function(e){return e.data.token?o.a.createElement(b.d,null,o.a.createElement(b.a,{exact:!0,from:"/",to:"/dialogs"}),o.a.createElement(b.a,{from:"/auth",to:"/dialogs"}),o.a.createElement(b.b,{exact:!0,path:"/dialogs",render:function(t){return o.a.createElement(O,Object.assign({},t,{context:e}))}}),o.a.createElement(b.b,{path:"/dialogs/:dialogId/choose-role",render:function(e){return o.a.createElement(x,e)}}),o.a.createElement(b.b,{path:"/dialogs/:dialogId/practice",render:function(t){return o.a.createElement(T,Object.assign({},t,{context:e}))}})):o.a.createElement(o.a.Fragment,null,o.a.createElement(b.a,{from:"/",to:"/auth"}),o.a.createElement(b.b,{path:"/auth",component:L}))})))}}]),t}(o.a.Component);s.a.render(o.a.createElement(M,{speechRecognition:new webkitSpeechRecognition}),document.getElementById("root"))}},[[24,1,2]]]);
//# sourceMappingURL=main.eeadf40b.chunk.js.map