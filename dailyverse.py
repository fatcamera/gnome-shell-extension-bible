#!/usr/bin/env python
import datetime, httplib, re;

date = datetime.date(2000,1,1);
delta = datetime.timedelta(1);
f = open('dailyverse', 'w');
while date.year < 2001 :
	con = httplib.HTTPConnection('www.biblegateway.com');
	url = '/votd/get/?format=json&month=%d&day=%d' % (date.month, date.day);
	con.request('GET', url);
	r = con.getresponse();
	if r.status == 200 :
		json_data = r.read();
		ref = re.search('\"reference\"\s*:\s*\"([^\"]*)\"',json_data).group(1);
		f.write("'%d-%d' : '%s',\n" % (date.month, date.day, ref));
	else :
		print '%d-%d : %s\n' % (date.month, date.day, r.reason)
	date += delta;
f.close();


