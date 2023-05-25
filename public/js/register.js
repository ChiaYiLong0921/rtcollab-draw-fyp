const formDOM = document.querySelector(".form");
const usernameInputDOM = document.querySelector(".username-input");
const emailInputDOM = document.querySelector(".email-input");
const passwordInputDOM = document.querySelector(".password-input");
// const formAlertDOM = document.querySelector('.form-alert')
// const resultDOM = document.querySelector('.result')
// const btnDOM = document.querySelector('#data')
// const tokenDOM = document.querySelector('.token')

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  // formAlertDOM.classList.remove('text-success')
  // tokenDOM.classList.remove('text-success')

  e.preventDefault();
  const username = usernameInputDOM.value;
  const email = emailInputDOM.value;
  const password = passwordInputDOM.value;

  try {
    const { data } = await axios.post("/api/v1/auth/register", {
        name:username,
        email:email,
        password:password,
    });
    console.log("register data: ", data);
    console.log("register user: ", data.user);
    console.log(data.token);

    usernameInputDOM.value = "";
    emailInputDOM.value = "";
    passwordInputDOM.value = "";
    localStorage.setItem(`${data.user._id}`, JSON.stringify(data));
    // localStorage.setItem('token', data.token)
    window.location.href = `home.html?id=${data.user._id}`;

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
  // setTimeout(() => {
  //   formAlertDOM.style.display = 'none'
  // }, 2000)
});
