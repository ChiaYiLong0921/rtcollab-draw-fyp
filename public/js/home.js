const createBtn = document.querySelector('#createws')
const logoutBtn = document.querySelector('#logout')
const params = window.location.search;
const id = new URLSearchParams(params).get("id");

console.log(id);
const localData = JSON.parse(localStorage.getItem(`${id}`));
if (!localData){
  alert("You are unauthorize");
  window.location.href = `index.html`;
}
const token = localData.token;
const user = localData.user;

const display = async () => {
  
  console.log('user details: ', user);
  const heading = document.createElement('h2')
  heading.innerText = `Hi ${user.name}`
  document.body.prepend(heading)
  try {
    const { data } = await axios.get("/api/v1/workspace", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      id,
    });
    const container = document.querySelector('#container')
    const countText = document.createElement('p')
    countText.innerText = `You have ${data.count} workspaces`
    container.prepend(countText)
    const wsTable = document.createElement('table')
    wsTable.setAttribute("style","border: 2px solid black; border-spacing:25px;")
    wsTable.innerHTML = `<tr>
        <th>id</th>
        <th>name</th>
      </tr>`;
    console.log(data.allWorkspace);
    data.allWorkspace.forEach((workspace) => {
        console.log(workspace.name);
        const wsLink = document.createElement('tr')
        wsLink.innerHTML = `<td><a href="workspace.html?id=${user._id}&wsid=${workspace._id}">${workspace._id}</a></td><td>${workspace.name}</td>`;
        wsTable.appendChild(wsLink)
    })
    container.appendChild(wsTable)
    //   formAlertDOM.style.display = "block";
    //   formAlertDOM.textContent = data.msg;

    //   formAlertDOM.classList.add("text-success");
    //   emailInputDOM.value = "";
    //   passwordInputDOM.value = "";

    //   localStorage.setItem("token", data.token);
    //   window.location.assign(`home.html?id=${data.user.id}`);

    // resultDOM.innerHTML = ''
    // tokenDOM.textContent = 'token present'
    // tokenDOM.classList.add('text-success')
  } catch (error) {
    console.log(error.response.data.msg);
    // formAlertDOM.style.display = 'block'
    // formAlertDOM.textContent = error.response.data.msg
    // localStorage.removeItem('token')
    // resultDOM.innerHTML = ''
    // tokenDOM.textContent = 'no token present'
    // tokenDOM.classList.remove('text-success')
  }
};

logoutBtn.addEventListener('click', function(){
    localStorage.removeItem(`${user._id}`)
    window.location.href = `/index.html`;
})

createBtn.addEventListener("click", function () {
  
  window.location.href = `createws.html?id=${user._id}`;
});

const checkToken = () =>{
    
  if(!token) {
    console.log("You are unauthorize");
    // window.location.reload(true)
    // window.location.href = `/index.html`;

  }
}

checkToken();
display();



