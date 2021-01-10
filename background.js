// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

const targetPage = 'zhipin.com'
const mainSiteURL = 'https://www.wondercv.com/cvs'
const mainSiteDomain = '.wondercv.com'
const cookieName = 'sdktoken'

// installed
chrome.runtime.onInstalled.addListener(function() {})

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.update(tab.id, { selected: true, url: mainSiteURL })
})

chrome.windows.onCreated.addListener(function(createInfo) {
  checkisAuthed()
})

function setBrowserActionIcon(iconPath) {
  chrome.browserAction.setIcon({ path: iconPath })
}

chrome.cookies.onChanged.addListener(function(changeInfo) {
  const { cookie } = changeInfo || {}
  if (cookie && cookie.domain && cookie.domain.indexOf(mainSiteDomain) !== 1) {
    checkisAuthed()
  }
})

function checkisAuthed() {
  chrome.cookies.get({ name: cookieName, url: 'http://www.wondercv.com/talent'  }, function(cookie) {
    if (cookie) {
      setBrowserActionIcon("images/icon-19.png")
      return
    }
    setBrowserActionIcon("images/get_started16.png")
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && tab.selected && tab.status === "complete") {
    if (tab.url.indexOf(targetPage) !== -1) {
      alert(JSON.stringify(tabId))
      alert(JSON.stringify(changeInfo))
      alert(JSON.stringify(tab))
    }
  }
})
