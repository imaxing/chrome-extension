'use strict'

// function Recommend(data) {
//   this.data = data || {}
// }

// Recommend.prototype.render = function (data) {

//   this.close()
//   const el = document.createElement('div')
  
//   el.innerHTML = `
//     <h2>超级简历职位分析</h2>
//     <span class="close_el">关闭</span>
//     ${JSON.stringify(data)}
//   `
//   el.className = 'job_info'
//   document.body.appendChild(el)
//   const timer = setTimeout(() => {
//     const close_el = document.querySelector('.close_el')
//     if (close_el) {
//       close_el.addEventListener('click', this.close, false)
//     }
//     clearTimeout(timer)
//   }, 0)
// }

// Recommend.prototype.close = function () {
//   const job_info = document.querySelector('.job_info')
//   document.body.removeChild(job_info)
// }

// Recommend.prototype.getUserState = function () {
//   const cookies = document.cookies
//   this.render({ cookies })
// }

// const recommendIns = new Recommend()


// 接收插件后台消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'get_info') {
    let cvInfo = getCvInfo()
    if (cvInfo) {
      renderModal(cvInfo)
    }
  }

  sendResponse('我是content,已收到你的消息')
})


// // 向插件后台发消息
// function sendMsgToBackground(message, callback){
//   chrome.runtime.sendMessage(message, response => {
//     callback && callback(response)
//   })
// }

const prefixClass = 'job-scan'
const modalID = `${prefixClass}-modal`
const targetCvClass = '.job-list ul'

function getCvInfo() {
  const cVdom = document.querySelector(targetCvClass)
  if (cVdom) {
    return cVdom.innerHTML
  }
  return ''
}

function renderModal(cvInfo) {
  let modalEl = document.querySelector(`#${modalID}`)
  
  if (!modalEl) {
    modalEl = document.createElement('div')
  
    modalEl.innerHTML = `
      <div class="${prefixClass}-header">
        <h2>超级简历职位分析</h2>
        <span id="${prefixClass}-close-btn" class="close-btn">关闭</span>
      </div>
      <div class="${prefixClass}-body">${cvInfo}</div>
    `
    modalEl.id = modalID
    modalEl.className = `${prefixClass}-box`
    document.body.appendChild(modalEl)
  } else {
    modalEl.innerHTML = `
      <div class="${prefixClass}-header">
        <h2>超级简历职位分析</h2>
        <span id="${prefixClass}-close-btn" class="close-btn">关闭</span>
      </div>
      <div class="${prefixClass}-body">${cvInfo}</div>
    `
  }

  document.querySelector(`#${prefixClass}-close-btn`).addEventListener('click', function() {
    document.body.removeChild(modalEl)
  })
}
