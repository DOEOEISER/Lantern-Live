/*
*
* Copyright (c) 2015 U.S. Government (U.S. Department of Energy transferred by assignment pursuant to 17 USC 105)
*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var uaCode = "UA-55903649-1";
var gaPlugin;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('pause', this.onPause, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        gaPlugin = window.plugins.gaPlugin;
        if(gaPlugin) { gaPlugin.init(null, null, uaCode, 10); }
        app.receivedEvent('deviceready');
    },
    onResume: function() {
        if(gaPlugin) { gaPlugin.init(null, null, uaCode, 10); }
        app.receivedEvent('resume');
    },
    onPause: function() {
        if(gaPlugin) { gaPlugin.exit(null, null); }
        app.receivedEvent('pause');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //console.log('Received Event: ' + id);
    }
};
