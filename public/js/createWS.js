const nameInput = document.querySelector('.workspaceName')
const submit = document.querySelector('#submit')
const returnHome = document.querySelector('#return')

const params = window.location.search;
const id = new URLSearchParams(params).get("id");

const localData = JSON.parse(localStorage.getItem(`${id}`));
if (!localData) {
  alert("You are unauthorize");
  window.location.href = `index.html`;
}
const token = localData.token;
const user = localData.user;

submit.addEventListener('click', async function(e){
    e.preventDefault()
    const name = nameInput.value

    try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('submit to server');
    const { data } = await axios.post(`/api/v1/workspace`, {
      name: name,
    }, options);
    console.log('login data: ',data);
    alert('Workspace added');
    // console.log(data.token);
    // formAlertDOM.style.display = 'block'
    // formAlertDOM.textContent = data.msg

    // formAlertDOM.classList.add('text-success')
    // emailInputDOM.value = ''
    // passwordInputDOM.value = ''
    // localStorage.setItem(`${data.user._id}`, JSON.stringify(data))
    // window.location.href = `home.html?id=${data.user._id}`;
    
    // resultDOM.innerHTML = ''
    // tokenDOM.textContent = 'token present'
    // tokenDOM.classList.add('text-success')
  } catch (error) {
    alert(error.response.data.msg);
    // console.log(error);
    // formAlertDOM.style.display = 'block'
    // formAlertDOM.textContent = error.response.data.msg
    // localStorage.removeItem('token')
    // resultDOM.innerHTML = ''
    // tokenDOM.textContent = 'no token present'
    // tokenDOM.classList.remove('text-success')
  }

})

returnHome.addEventListener('click', function(){
  window.location.href = `home.html?id=${user._id}`;

})