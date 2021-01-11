'use strict'



const prefixClass = 'job-scan'
const modalID = `${prefixClass}-modal`





// 检测简历 dom class 是否出现在页面中
function getCvResumeInfo() {
  const cvDom = document.querySelector('.job-sec')
  if(cvDom) {
    alert('检测到岗位描述信息, 弹出弹窗')
  }
  return cvDom.innerHTML || null
}

// 关闭窗口
function closeModal () {
  let modalEl = document.querySelector(`#${modalID}`)
  if (modalEl) {
    document.body.removeChild(modalEl)
  }
}


// 接收插件后台消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'get_info') {
    let resumeInfo = getCvResumeInfo()
    if (resumeInfo) {
      renderModal(resumeInfo)
    } else {
      closeModal()
    }
  }
  sendResponse('我是content,已收到你的消息')
})


function modalTemplate(resumeInfo) {
  return `
    <div class="${prefixClass}-header">
      <h2>超级简历职位分析</h2>
      <span id="${prefixClass}-close-btn" class="close-btn">关闭</span>
    </div>
    <div class="${prefixClass}-body">${resumeInfo}</div>
  `
}

function renderModal(cvInfo) {
  let modalEl = document.querySelector(`#${modalID}`)
  const modalContent = modalTemplate(cvInfo)

  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.innerHTML = modalContent
    modalEl.id = modalID
    modalEl.className = `${prefixClass}-box`
    document.body.appendChild(modalEl)
    
  } else {
    modalEl.innerHTML = modalContent
  }
  document.querySelector(`#${prefixClass}-close-btn`).addEventListener('click', closeModal)
}



// // 向插件后台发消息
// function sendMsgToBackground(message, callback){
//   chrome.runtime.sendMessage(message, response => {
//     callback && callback(response)
//   })
// }
