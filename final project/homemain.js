let page =1
let lastpage =1
let posts = document.getElementById('posts');
posts.innerHTML ='';
updatui()
showposts()
function showposts(page =1){
toggleloader()
axios.get(`http://tarmeezacademy.com/api/v1/posts?page=${page}&limit=5`)
.then((responses)=>{
  toggleloader(false)
    lastpage = responses.data.meta.last_page;
    elements = responses.data.data;
    let content =''
    for (element of elements){
        let body = ''
        let title = ''
        let btncontent = ``
        let user = JSON.parse(localStorage.getItem('user'));
        editable = user !=null && user.id == element.author.id
        if (editable){
            btncontent = `
            <button class="btn btn-danger mx-2" style=" float:right" onclick="deletpost(${element.id})">delet</button>
            <button class="btn btn-secondary" style=" float:right" onclick="editpost('${encodeURIComponent(JSON.stringify(element))}')">edit</button>`
        }else{
            btncontent =''
        }
        if (element.body != null){
            body = element.body;
        }
        if (element.title != null){
            title = element.title;
        }
        let contentTag = ''
        let tags = element.tags;
        for (tag of tags){
            contentTag +=`
            <button type="button" class="btn btn-dark rounded-pill mx-1">${tag.name}</button>
            `
        }

        content +=`
        <div class="card mt-3 shadow">
        <div class="card-header">
            <img src="${element.author.profile_image}" alt="" style="width: 20px; height: 20px;">
            <b class="mx-1" onclick="showprofile(${element.author.id})" style="cursor: pointer;">${element.author.username}</b>
            ${btncontent}
        </div>
        <div class="card-body" onclick="showuserpost(${element.id})" style="cursor: pointer;">
            <img style="width: 100%; height: 250px;" src="${element.image}" alt="">
            <h6 style="color: rgb(168, 167, 167);" class="mt-2">${element.created_at}</h6>
            <h4 >${title}</h4>
            <p>${body}</p>
            <hr>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
            </svg>
            <span>(${element.comments_count}) comments</span>
            <div style="display: inline-block;">
            ${contentTag}
            </div>
        </div>
        </div>
        </div>
        `
  }
  posts.innerHTML += content;
})
}

function creatnewpost(){
  const id = document.getElementById('statepost').value;
  const title = document.getElementById('title-input').value ;
  const body = document.getElementById('body-input').value ;
  const image = document.getElementById('post-image').files[0] ;
  const token = localStorage.getItem('token');
  let iscreat = id == null || id ==''
  const headers = {
      "Content-Type":"multipart/form-data",
      "Authorization": `Bearer ${token}`
  }
  let formdata = new FormData();
  formdata.append('title',title);
  formdata.append('body',body);
  formdata.append('image',image);
  if (iscreat){
    axios.post("https://tarmeezacademy.com/api/v1/posts",formdata,{
        headers : headers
    })
    .then((respon)=>{
      showmessage('the post is added','success');
      setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
      },2000)
      const modal = document.getElementById('postModal');
      const modalinstanse = bootstrap.Modal.getInstance(modal);
      modalinstanse.hide()
      showposts()
      location.reload()
    }).catch(error=>{
      showmessage(error.response.data.message,'danger')
      setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
    },2000)
    })
  }else{
    formdata.append("_method","put")
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}`,formdata,{
        headers : headers
    })
    .then((respon)=>{
      showmessage('the post is updated','success');
      console.log(respon)
      setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
      },2000)
      const modal = document.getElementById('postModal');
      const modalinstanse = bootstrap.Modal.getInstance(modal);
      modalinstanse.hide()
      showposts()
      location.reload()
    }).catch(error=>{
      showmessage(error.response.data.error_message,'danger')
      console.log(error)
      setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
    },2000)
    })
  }

}

window.addEventListener('scroll', function() {
  const scrollableHeight = document.documentElement.scrollHeight;
  const currentScrollPosition = window.scrollY + window.innerHeight;
  if ((currentScrollPosition >= 0.9*scrollableHeight)&& (page < lastpage)) {
      page++;
      showposts(page)
  }
});

function showuserpost(id){
 window.location = `postdetils.html?userid=${id}`

}

function editpost(postobject){
let post = JSON.parse(decodeURIComponent(postobject))
document.getElementById('statepost').value = post.id
document.getElementById('title-input').value = post.title
document.getElementById('body-input').value = post.body
document.getElementById('btnedit').innerHTML = 'edit'
document.getElementById('title-post-Modal').innerHTML = 'Edit post'
const postmodal = new bootstrap.Modal(document.getElementById('postModal'),{})
postmodal.toggle()
}

function clearinput(){
    document.getElementById('title-post-Modal').innerHTML = 'Creat post'
    document.getElementById('statepost').value = ''
    document.getElementById('title-input').value = ''
    document.getElementById('body-input').value = ''
    document.getElementById('btnedit').innerHTML = 'creat'
}

function deletpost(id){
    const token = localStorage.getItem('token')
    const headers = {
        "Content-Type":"multipart/form-data",
        "Authorization": `Bearer ${token}`
    }
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`,{
        headers:headers
    })
    .then(respone=>{
        showmessage("the post is deleted","success")
        setTimeout(()=>{
            const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
            alert.close()
          },2000)
        showposts()
        location.reload()
    })
}  

function showprofile(id){
  window.location = `profile.html?userid=${id}`
}