// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'


let activeURL = ''
const targetPage = 'baidu.com'
const mainSiteURL = 'https://www.wondercv.com/cvs'
const RULE = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { urlContains: targetPage }
    })
  ],
  actions: [ new chrome.declarativeContent.ShowPageAction() ]
}


// installed
chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([RULE])
  })
  


  // pageAction.onClicked
  chrome.pageAction.onClicked.addListener(() => {
    alert('pageAction.onClicked')
  })
  

  // browserAction.onClicked
  chrome.browserAction.onClicked.addListener(() => {
    alert('browserAction.onClicked')
  })


  // contextMenus.onClicked
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == 'create-command') {
      chrome.windows.create({ url: 'https://www.wondercv.com/cvs' }, (win) => {
        sendMsgToContentScript({ type: 'get_user_state', value: { win } })
      })
      // sendMsgToContentScript({ type: 'get_info', value: { url: activeURL } })
    }
  })


  // tabs.onUpdated
  chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
    
    activeURL = tab.url

    // if (activeURL.includes(mainSiteURL)) {
    //   alert('打开了主站')
    // }

    const isIncludes = activeURL.includes(targetPage)
    const params = { 
      url: activeURL, 
      tabId, 
      includes: isIncludes ? 'yes' : 'no'
    }
    if (changeInfo.status === 'complete') {
      // alert('tabs.onUpdated')
      sendMsgToContentScript({ 
        type: 'get_info', 
        value: params
      })
      isIncludes ? chrome.pageAction.show(tabId) : chrome.pageAction.hide(tabId)
    }
    
    if (activeURL.includes(targetPage)) {
      
    } else {
      
    }
  })

})








// 向 content 发消息
function sendMsgToContentScript(message, callback){
  chrome.tabs.getSelected(null, tab => {
    chrome.tabs.sendMessage(tab.id, message, response => {
      callback && callback(response)
    })
  })
}

// 接收 content 消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === 'contentMsg'){
    console.log('收到来自content的消息：' + request.value)
  }
  sendResponse('我是后台，已收到你的消息。')
})



/**
 * 
 * 
  chrome.contextMenus.create({
    id: 'create-command',
    title: '超级简历-生成职位匹配信息',
    contexts: ['all']
  })
  chrome.contextMenus.remove('create-command')
 * 
 * 
 */
