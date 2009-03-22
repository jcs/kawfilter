// $Id: kawfilter.user.js,v 1.2 2009/03/22 18:37:15 jcs Exp $

// ==UserScript==
// @name           kawfilter
// @namespace      http://jcs.org/code/
// @description    hide posts and threads made by certain users, or matching certain subjects
// @include        http://forums.wayot.org/other/
// @include        http://forums.wayot.org/other/pages/*
// @include        http://f.wayot.org/other/
// @include        http://f.wayot.org/other/pages/*
// @author         jcs@jcs.org
// ==/UserScript==

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
