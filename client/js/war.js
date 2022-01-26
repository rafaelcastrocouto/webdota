window.addEventListener('load', function() {
  var init = function() {
    container.init();
    snow.init();
    nav.init();
    link.init();
    players.init();
    // chat.init();
  };
  window.v = {};
  /*//////////////////////////////////////////////////////////////////////*/
  var create = {
    el: function(t) {
      return document.createElement(t);
    }
  };
  v.create = create;
  var get = {
    id: function(i) {
      return document.getElementById(i);
    },
    cl: function(c) {
      var els = document.getElementsByClassName(c);
      els.each = function(f) {
        for (var i = 0; i < els.length; i++) {
          f(els[i], i);
        }
      };
      return els;
    }
  };
  v.get = get;
  /*//////////////////////////////////////////////////////////////////////*/
  var css = function(e, prop, val, un) {
    if (val)
      e.style[prop] = val + (un || '');
    else return e.style[prop];
  };
  css.fade = {
    show: function(e, s) {
      var el = get.id(e);
      css(el, 'display', 'block');
      css.fade.render(el, 0, s, 'opacity', '1');
    },
    hide: function(e, s) {
      var el = get.id(e);
      css.fade.render(el, 100, (-1 * s), 'display', 'none', 1);
    },
    render: function(e, o, s, p, v, m) {
      o += s;
      css(e, 'opacity', '0.' + o);
      var tester = function(o, m) {
        if (m) return (o > 0);
        else return (o < 100);
      }
      if (tester(o, m))
        setTimeout(function() {
          css.fade.render(e, o, s, p, v, m)
        }, 50);
      else css(e, p, v);
    }
  };
  css.anim = {
    on: 0,
    start: function() {
      if (!css.anim.on) {
        css.anim.on = 1;
        get.cl('anim').each(function(e) {
          css(e, 'transition', 'top 0.5s ease-in-out');
        });
      }
    },
    stop: function() {
      if (css.anim.on) {
        css.anim.on = 0;
        get.cl('anim').each(function(e) {
          css(e, 'transition', 'none');
        });
      }
    }
  };
  css.slide = {
    down: function(i) {
      setTimeout(function() {
        css(get.id(i), 'top', '0');
      }, 500);
      clearTimeout(css.slide.toff);
      css.slide.toff = setTimeout(function() {
        css.anim.stop();
      }, 1000);
    },
    up: function(i) {
      css.anim.start();
      css(get.id(i), 'top', '-50', 'em');
    }
  };
  css.noselect = function() {
    document.onselectstart = function() { return false; };
  };
  v.css = css;
  /*//////////////////////////////////////////////////////////////////////*/
  var container = {
    fade: function() {
      var b = get.id('blackfade');
      if (css(b, 'display') == 'none') {
        css(get.id('blackfade'), 'display', 'block');
        css(get.id('blackfade'), 'opacity', '1');
        clearTimeout(container.timeout);
        container.timeout = setTimeout(function() {
          container.resize();
          snow.init();
          css.fade.hide('blackfade', 10);
        }, 60);
      }
    },
    resize: function() {
      var c = get.id('container'), i = get.id('chatinputtext'), h = window.innerHeight, w = window.innerWidth, r = 683 / 384, nh, nw;
      if (w / h > r) {
        nw = parseInt(h * r);
        nh = h;
      } else {
        nw = w;
        nh = parseInt(w / r);
      }
      container.width = nw;
      container.height = nh;
      css(c, 'height', nh, 'px');
      css(c, 'width', nw, 'px');
      css(document.body, 'font-size', nw / 80, 'px');
      css(i, 'font-size', nw / 80, 'px');
    },
    init: function() {
      container.resize();
      window.addEventListener('resize', function() {
        //container.resize();
        container.fade();

      });
    }
  };
  v.container = container;
  /*//////////////////////////////////////////////////////////////////////*/
  var snow = {
    count: 160,
    slow: 4,
    canvas: get.id('snow'),
    init: function() {
      snow.ctx = snow.canvas.getContext('2d');
      snow.canvas.width = container.width;
      snow.canvas.height = container.height;
      snow.min = container.width / 250;
      snow.max = container.width / 125;
      snow.wind = container.width / 1200;
      snow.flakes = [];
      for (var flake = 0; flake < snow.count; flake++) {
        snow.flakes[flake] = {}
      }
      if (snow.time) clearTimeout(snow.time);
      snow.anim();
    },
    anim: function() {
      snow.ctx.clearRect(0, 0, container.width, container.height);
      for (var flake = 0; flake < snow.count; flake++) snow.render(flake)
      snow.time = setTimeout(snow.anim, 25)
    },
    render: function(f) {
      var r = snow.flakes[f].r || snow.random(snow.min, snow.max)
        , x = snow.flakes[f].x || snow.random(0, container.width)
        , d = snow.flakes[f].d || snow.random(-snow.wind, snow.wind)
        , y = snow.flakes[f].y || snow.random(0, container.height);
      x += d;
      if (x < 0) x = container.width;
      if (x > container.width) x = 1;
      if (y < (container.height)) y += (r / snow.slow);
      else y = 1;

      var cx = x + r / 2, cy = y + r / 2, 
      grad = snow.ctx.createRadialGradient(cx, cy + r / 8, r / 5, cx, cy, r / 2);
      grad.addColorStop(0, 'rgba(255,255,255,0.8)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.4)');
      grad.addColorStop(1, 'transparent');
      snow.ctx.fillStyle = grad;
      snow.ctx.fillRect(x, y, r, r);
      snow.flakes[f] = {r,d,x,y};
    },
    random: function(min, max) {
      return min + Math.random() * (max - min)
    }
  };
  v.snow = snow;
  /*//////////////////////////////////////////////////////////////////////*/
  var nav = {
    screen: 'first_screen',
    init: function() {
      get.id('cancel').addEventListener('click', function() {
        client.send({ type: 'leaveroom' });
        nav.slide('first_screen');
      });
      get.id('credit').addEventListener('click', function() {
        css.fade.show('credits', 10);
      });
      get.id('closecredit').addEventListener('click', function() {
        css.fade.hide('credits', 10);
      });
      get.id('option').addEventListener('click', function() {
        nav.slide('options');
      });
      get.id('back').addEventListener('click', function() {
        nav.slide('first_screen');
      });
      get.id('start').addEventListener('click', function() {
        alert('Webdota is comming soon!')
      });
      css.fade.hide('blackfade', 10)
    },
    slide: function(p) {
      css.slide.down(p);
      css.slide.up(nav.screen);
      nav.screen = p;
    },
    enablejoin: function() {
      var p = get.id('play');
      p.className = 'enable';
      p.addEventListener('click', function() {
        var m = {
          type: 'gimmeroom'
        };
        client.send(m);
      });
    },
    play: function() {
      get.id('gamename').textContent = 'Room ' + client.room;
      get.id('mapname').textContent = map.name;
      get.id('map-mp').textContent = map.maxPlayers;
      get.id('map-sp').textContent = map.sugestedPlayers;
      get.id('mapsize').textContent = map.size;
      get.id('mapauthor').textContent = map.author;
      players.update();
      nav.slide('room');
    }
  };
  v.nav = nav;
  /*//////////////////////////////////////////////////////////////////////*/
  var link = {
    links: {
      help: 'dota2.com',
      blizzard: 'http://us.blizzard.com',
      icefrog: 'http://en.wikipedia.org/wiki/IceFrog',
      me: 'http://raf.hns.to/'
    },
    a: function(i, url) {
      get.id(i).addEventListener('click', function() {
        window.open(url)
      });
    },
    init: function() {
      css.noselect();
      for (var i in link.links) {
        link.a(i, link.links[i]);
      }
    }
  };
  v.link = link;
  /*//////////////////////////////////////////////////////////////////////*/
  var players = {
    init: function() {
      get.cl('dl').each(players.hideDl);
      get.cl('color').each(players.paint);
    },
    update: function() {
      var li = get.cl('player'), t = 'Open';
      for (var i = 0; i < li.length; i++) {
        var p = client.rooms[client.room][i], 
            l = li[i].childNodes[1].textContent;
        if (p) {
          if (p == client.player) {
            li[i].className = 'player host';
          } else {
            if (l == 'Open') chat.joined({ player: p});
            li[i].className = 'player disable';
          }
          t = p;
        } else {
          if (l != 'Open') {
            chat.left({ player: l });
          }
          t = 'Open';
        }
        li[i].childNodes[1].textContent = t;
      }
    },
    hideDl: function(a) {
      var t = a.innerText;
      if (t == '0' || t == '100') { a.innerText = ''; }
    },
    colors: ['blue', 'cyan', 'purple', 'yellow', 'orange', 'pink', 'lightgrey', 'lightblue', 'darkgreen', 'brown'],
    paint: function(a, i) {
      var c = create.el('b');
      css(c, 'background', players.colors[i]);
      a.appendChild(c);
    }
  };
  v.players = players;
  /*//////////////////////////////////////////////////////////////////////*/

  /*v.ping = function(){ 
		var d = new Date().getTime();
		v.socket.send(d);
		return 'Sending ping...';
  }*/
  /*//////////////////////////////////////////////////////////////////////*/
  var chat = {
    input: get.id('chatinputtext'),
    messages: get.id('messages'),
    scroll: get.id('scroll'),
    init: function() {
      messages.innerHTML = '';
      chat.input.addEventListener('keypress', function(e) {
        if (e.keyCode == 13)
          chat.send();
        //attach enter event
      });
    },
    send: function() {
      var message = chat.input.value;
      if (!message)
        return;
      chat.input.value = '';
      //erases input
      var m = {
        type: 'chat',
        message: message,
        room: client.room
      }
      client.send(m);
    },
    receive: function(m) {
      var s = 0;
      if (m.player == client.player)
        s = 1;
      p = '<p><b class="chatname">' + m.player + ': </b>' + m.message + '</p>';
      chat.write(p, s);
    },
    joined: function(m) {
      if (m.player != client.player) {
        p = '<p><b class="chatsys">' + m.player + ' has joined the game.';
        chat.write(p);
      }
    },
    left: function(m) {
      if (m.player != client.player) {
        p = '<p><b class="chatsys">' + m.player + ' has left the game.';
        chat.write(p);
      }
    },
    write: function(p, s) {
      var sc = s || 0;
      if (chat.scroll.scrollTop == chat.scroll_bottom())
        sc = 1;
      chat.messages.innerHTML += p;
      if (sc)
        chat.scroll.scrollTop = chat.scroll_bottom();
    },
    scroll_bottom: function() {
      var el_height = chat.scroll.getClientRects()[0].height
        , sc_height = chat.scroll.scrollHeight;
      return sc_height - el_height;
    }
  };
  v.chat = chat;
  /*//////////////////////////////////////////////////////////////////////*/
  init();
});
