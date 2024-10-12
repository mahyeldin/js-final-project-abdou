function updatui(){ 
  const token = localStorage.getItem('token')
  const btn  = document.getElementById('btn')
  const user = JSON.parse(localStorage.getItem('user'))
  const addbtn = document.getElementById('add-btn')
  const profilebtn = document.getElementById('profilebtn')
  if (token == null){
  profilebtn.style.display ='none'
  btn.innerHTML= `
    <div >
      <button  class="btn btn-outline-success mx-3 " data-bs-toggle="modal" data-bs-target="#exampleModal">login</button>
      <button class="btn btn-outline-success " data-bs-toggle="modal" data-bs-target="#registerModal">register</button>
    </div>
  `  
    if (addbtn !=null) {
        addbtn.style.visibility = 'hidden'
    }
  }else{
    profilebtn.style.display = 'block'
    btn.innerHTML =`
      <div>
        <img src="${user.profile_image}" alt="" style="width = 20px; height:20px;" class="rounded-circle" >
        <span>${user.username}<span>
        <button  class="btn btn-outline-danger mx-3 " onclick="logout()">logout</button>
      </div>
    `
      if (addbtn !=null) {
      addbtn.style.visibility = 'visible'
    }
  }
}

function loginfunc(){
  const username = document.getElementById('username-input').value;
  const password = document.getElementById('password-input').value;
  const params = {
   'username' : username,
   'password' : password
  }
  toggleloader()
  axios.post('https://tarmeezacademy.com/api/v1/login',params)
  .then((respon)=>{
    toggleloader(false)
    localStorage.setItem('token',respon.data.token)
    localStorage.setItem('user',JSON.stringify(respon.data.user))
    const modal = document.getElementById('exampleModal');
    const modalinstanse = bootstrap.Modal.getInstance(modal);
    modalinstanse.hide()
    showmessage('login succufly , hello','success');
    updatui();
    setTimeout(()=>{
       const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
       alert.close()
    },1000)
  })
}

function showmessage(message,type){
  document.getElementById('problem').innerHTML = `<div  id="liveAlertPlaceholder" class="show fade" style="width: 30%; position: absolute; bottom:0; right:0; z-index: 4444;"></div>`
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close id="close-btn"></button>',
      '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  }
  appendAlert(message,type)
}

function logout(){
  localStorage.clear();
  updatui()
  showmessage('you logout succufly','danger');
  setTimeout(()=>{
      const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
      alert.close()
   },1000)
   window.location = 'index.html'
}

function register(){
  const img = document.getElementById('regist-image').files[0];
  const name = document.getElementById('regist-name-input').value;
  const username = document.getElementById('regist-username-input').value;
  const password = document.getElementById('regist-password-input').value;
  const gmail = document.getElementById('regist-gmail-input').value;
  const formdata = new FormData();
  formdata.append("name",name);
  formdata.append("username",username);
  formdata.append("password",password);
  formdata.append("gmail",gmail);
  formdata.append("image",img);
  toggleloader()
  axios.post('https://tarmeezacademy.com/api/v1/register',formdata,{
      headers : {
          "Content-Type":"Content-Type"
      }
  })
  .then((respone)=>{
       toggleloader(false)
       localStorage.setItem('token',respone.data.token)
       localStorage.setItem('user',JSON.stringify(respone.data.user))
       const modal = document.getElementById('registerModal');
       const modalinstanse = bootstrap.Modal.getInstance(modal);
       modalinstanse.hide();
       showmessage('register succuffly, welcome to the website','success');
       updatui();
       setTimeout(()=>{
          const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
          alert.close()
      },2000)
  })
  .catch((error)=>{
      showmessage(error.response.data.message,'danger');
       setTimeout(()=>{
          const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
          alert.close()
      },2000)

  })
}

function toggleloader(x=true){
  if (x){
    document.getElementById('loader').style.visibility = 'visible'
  }else{
    document.getElementById('loader').style.visibility = 'hidden'
  }
}
toggleloader(false)
updatui()
