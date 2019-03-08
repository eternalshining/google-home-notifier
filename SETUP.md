CentOS6 での問題

mDNSが動いていない

yum install nss-mdns
# epel なら、avahi の依存も解決してくれる、nsswitch も直してくれる
https://qiita.com/iwaim@github/items/06d1f970eb9d3748e18f


dbus 問題でavahiが動かない
→ dbus を起動
service messagebus start
https://square501009.wordpress.com/2013/05/21/centos-6-4%E3%80%80%E6%A8%99%E6%BA%96%E8%B5%B7%E5%8B%95%E3%83%87%E3%83%BC%E3%83%A2%E3%83%B3/

https://qiita.com/touta/items/bf968d379199aefe7225
disallow-other-stacks=yes は実施した

mdnsを使う場合はファイルを書き換える
READMEの通り

/etc/sysconfig/iptables
-A INPUT -p udp --dport 5353 -j ACCEPT　#追記


