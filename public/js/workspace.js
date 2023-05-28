import { getStroke } from 'https://esm.sh/perfect-freehand'
import * as Y from 'https://esm.sh/yjs'
import { WebrtcProvider } from 'https://esm.sh/y-webrtc'

const svg = document.querySelector('svg')

const container = document.querySelector('.container')

const params = window.location.search
const id = new URLSearchParams(params).get('id')
const wsid = new URLSearchParams(params).get('wsid')
const back = document.querySelector('#back')
const localData = JSON.parse(localStorage.getItem(`${id}`))
if (!localData) {
  alert('You are unauthorize')
  window.location.href = `index.html`
}
const token = localData.token
const user = localData.user
const invite = document.querySelector('.invite-form')
const inviteHeading = document.querySelector('#form-heading')
const invitedEmailDOM = document.querySelector('.invited-email-input')

const imageUploaded = document.querySelector('#image')
const applyBackground = document.querySelector('#apply')
const background = document.querySelector('#background')

const removeBackground = document.querySelector('#remove')

let imageValue = null
let imgUrl
let workspaceName

async function fetchBackground() {
  try {
    const { data } = await axios.get(`/api/v1/workspace/${wsid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    workspaceName = data.workspace.name
    inviteHeading.textContent = `workspace ${workspaceName}`
    imgUrl = data.workspace.image
    svg.setAttribute('style', `background-image:url('${imgUrl}')`)
    console.log('fetch: ', data)
  } catch (error) {
    alert(error)
  }
}
fetchBackground()

invite.addEventListener('submit', async function (e) {
  e.preventDefault()
  const invitedEmail = invitedEmailDOM.value
  console.log(invitedEmail)
  console.log(wsid)
  console.log(token)
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const { data } = await axios.post(
      `/api/v1/workspace/${wsid}/invite`,
      {
        email: invitedEmail,
      },
      options
    )
    console.log('login data: ', data)
    alert('User Invited')
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
    alert(error.response.data.msg)
    // console.log(error);
    // formAlertDOM.style.display = 'block'
    // formAlertDOM.textContent = error.response.data.msg
    // localStorage.removeItem('token')
    // resultDOM.innerHTML = ''
    // tokenDOM.textContent = 'no token present'
    // tokenDOM.classList.remove('text-success')
  }
})

imageUploaded.addEventListener('change', async (e) => {
  const imageFile = e.target.files[0]
  const formData = new FormData()
  formData.append('image', imageFile)
  try {
    // {data:{image:{src}}}
    const {
      data: {
        image: { src },
      },
    } = await axios.post(`/api/v1/workspace/${wsid}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      'Content-Type': 'multipart/form-data',
    })
    imageValue = src
    console.log(imageValue)
  } catch (error) {
    imageValue = null
    console.log(error.response.data.msg)
  }
})

applyBackground.addEventListener('click', async (e) => {
  e.preventDefault()
  if (!imageValue) {
    alert('Upload image to apply')
    return
  }
  try {
    const { data } = await axios.patch(
      `/api/v1/workspace/${wsid}`,
      {
        image: imageValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    // console.log(data.workspace.image);
    imgUrl = data.workspace.image
    fetchBackground()
    console.log('After fetch: ', imgUrl)
  } catch (error) {
    alert(error.response.data.msg)
  }
})

removeBackground.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const { data } = await axios.patch(
      `/api/v1/workspace/${wsid}`,
      {
        image: null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log(data.workspace.image)
    imgUrl = data.workspace.image
    fetchBackground()
  } catch (error) {
    alert(error)
  }
})

back.addEventListener('click', function (e) {
  e.preventDefault()
  console.log(user)
  window.location.href = `home.html?id=${user._id}`
  // window.location.assign(`home.html?id=${data.user.id}`)
})

const checkToken = () => {
  if (!token) {
    alert('You are unauthorize')
    window.location.href = `/index.html`
  }
}

// checkToken();

const ydoc = new Y.Doc()
const provider = new WebrtcProvider(`collaborative whiteboard${wsid}`, ydoc)

const oneOf = (arr) => arr[Math.floor(Math.random() * arr.length)]

const colors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
]

const names = ['Alice', 'Bob', 'John', 'Peter']

const awareness = provider.awareness

awareness.setLocalStateField('user', {
  name: user.name,
  color: oneOf(colors).color,
})

awareness.on('change', (event) => {
  console.log('awareness change', awareness.getStates())
  svg.querySelectorAll('circle').forEach((circle) => circle.remove())
  awareness.getStates().forEach((state, clientID) => {
    if (clientID === awareness.clientID) {
      return
    }
    const pos = state.pos
    if (!pos) {
      return
    }
    const svgCircle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    svgCircle.setAttribute('cx', pos.x)
    svgCircle.setAttribute('cy', pos.y)
    svgCircle.setAttribute('r', 7)
    svgCircle.setAttribute('fill', state.user.color)
    svg.appendChild(svgCircle)
  })
})

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}
/*
    path: Y.Array<coords>,
    color: string

*/

const ystrokes = ydoc.getArray('strokes')

ystrokes.observe((event) => {
  event.changes.added.forEach((item) => {
    item.content.getContent().forEach((ystroke) => {
      const stroke = getStroke(ystroke.get('path').toArray())
      const svgPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      svgPath.setAttribute('d', getSvgPathFromStroke(stroke))
      svgPath.setAttribute('fill', ystroke.get('color'))
      svg.appendChild(svgPath)
      ystroke.get('path').observe((event) => {
        svgPath.setAttribute(
          'd',
          getSvgPathFromStroke(getStroke(ystroke.get('path').toArray()))
        )
      })
      ystroke.observe((event) => {
        if (event.keyChanged.has('color')) {
          svgPath.setAttribute('fill', ystroke.get('color'))
        }
      })
    })
  })
})
// const coords = [
//   [319, 103, 0.5],
//   [316, 102, 0.5],
//   [315, 102,0.5],
// ]
// const coords = [
//   [30, 30, .5],
//   [900, 80, .5],
//   [500, 50, .5]
// ]

// const newStroke = new Y.Array()
// newStroke.push(coords)

let currentStroke = null
svg.addEventListener('pointerdown', (event) => {
  currentStroke = new Y.Map()
  currentStroke.set('color', oneOf(colors).color)
  const currentPath = new Y.Array()
  currentPath.push([[event.x, event.y, event.pressure]])
  currentStroke.set('path', currentPath)
  ystrokes.push([currentStroke])
})

svg.addEventListener('pointermove', (event) => {
  awareness.setLocalStateField('pos', { x: event.x, y: event.y })
  if (event.buttons !== 1) {
    currentStroke = null
    return
  }
  currentStroke.get('path').push([[event.x, event.y, event.pressure]])
})
