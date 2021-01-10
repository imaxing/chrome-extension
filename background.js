// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

const targetPage = 'zhipin.com' // 目标站点
const mainSiteURL = 'https://www.wondercv.com/cvs' // 主站url
const mainSiteDomain = '.wondercv.com' // 主站的domain
const cookieName = 'sdktoken' // 判断登录状态的cookie的name

// installed
chrome.runtime.onInstalled.addListener(function() {
  // 插件安装的时候判断登录状态
  checkisAuthed()
})

// 点击图标的时候执行的逻辑
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.update(tab.id, { selected: true, url: mainSiteURL })
})


chrome.windows.onCreated.addListener(function(createInfo) {
  // 打开window的时候判断登录状态
  checkisAuthed()
})

// 动态设置browser_action的icon
function setBrowserActionIcon(iconPath) {
  chrome.browserAction.setIcon({ path: iconPath })
}

// 在主站执行登录退出时候判断登录状态
chrome.cookies.onChanged.addListener(function(changeInfo) {
  const { cookie } = changeInfo || {}
  if (cookie && cookie.domain && cookie.domain.indexOf(mainSiteDomain) !== 1) {
    checkisAuthed()
  }
})

// 判断登录状态
function checkisAuthed() {
  chrome.cookies.get({ name: cookieName, url: 'http://www.wondercv.com/talent'  }, function(cookie) {
    if (cookie) {
      setBrowserActionIcon("images/icon-19.png")
      return
    }
    setBrowserActionIcon("images/get_started16.png")
  })
}

// 向 content 发消息
function sendMsgToContentScript(message, callback) {
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

// 用户访问目标站点的时候执行的逻辑
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && tab.selected && tab.status === "complete") {
    if (tab.url.indexOf(targetPage) !== -1) {
      sendMsgToContentScript({ type: 'get_info', value: 'ssss' })
    }
  }
})
