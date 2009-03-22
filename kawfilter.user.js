// $Id: kawfilter.user.js,v 1.3 2009/03/22 18:44:08 jcs Exp $
//
// ==UserScript==
// @name           kawfilter
// @namespace      http://jcs.org/code/
// @description    hide posts and threads made by certain users, or matching certain subjects
// @include        http://forums.wayot.org/other/
// @include        http://forums.wayot.org/other/pages/*
// @include        http://f.wayot.org/other/
// @include        http://f.wayot.org/other/pages/*
// @author         joshua stein <jcs@jcs.org>
// ==/UserScript==
//
// Copyright (c) 2008-2009 joshua stein <jcs@jcs.org>
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
// 3. The name of the author may not be used to endorse or promote products
//    derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

// both of these searches are case insensitive and may contain regexp wildcards
// so be sure to escape regexp metachars (such as \*+?|{[()]^$.) with a
// backslash, but since they are in quotes, you have to escape the backslash
//
// "username (blah)" has to be "username \\(blah\\)"
// or just use single quotes for such things and write 'username \(blah\)'

// usernames to filter, must match entire username (case insensitive)
var usernames = [ "username 1", "troll.*" ];

// posts to filter by subject, only needs to match start of subject line
var subjects = [ "meal post" ];


// make this false to show replies under hidden posts
var hide_replies = true;

// make this true to completely kill matching lines instead of collapsing
var hide_matches = false;


var head = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = ".filtered a { font-size: smaller; color: gray; " +
	"text-decoration: none; }";
head.appendChild(style);

var ureg = new RegExp('href="([^"]+)".*&nbsp;&nbsp;(<b>(' + usernames.join('|')
	+ ')<\/b>.*)', 'i');
var sreg = new RegExp('href="([^"]+)">(' + subjects.join('|') +
	').*&nbsp;&nbsp;<b>(.+)<\/b>(.*)', 'i');

var lis = document.evaluate("//li", document.body, null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < lis.snapshotLength; i++) {
	a = lis.snapshotItem(i);

	match = false;
	if (usernames.length > 0 && (m = a.innerHTML.match(ureg))) {
		a.innerHTML = "<span class=\"filtered\"><a href=\"" + m[1] +
			"\">post by filtered user " + m[2].replace(/<\/?b>/, "") +
			"</a></span>";

		match = true;
	} else if (subjects.length > 0 && (m = a.innerHTML.match(sreg))) {
		a.innerHTML = "<span class=\"filtered\"><a href=\"" + m[1] +
			"\">post by " + m[2].replace(/<\/?b>/, "") + " with " +
			"filtered subject '" + subjects[j] + "' " + m[3] +
			"</a></span>";

		match = true;
	}

	if (match) {
		if (hide_replies)
			for (var c = 0; c < a.parentNode.childNodes.length; c++)
				if (a.parentNode.childNodes[c] == a)
					/* next node should be text, then a <ul> for the reply */
					for (var ch = c + 2; ch < a.parentNode.childNodes.length;
					ch += 2)
						if (z = a.parentNode.childNodes[ch])
							z.style.display = "none";

		if (hide_matches) {
			a.style.display = "none";
			continue;
		}
	}
}
