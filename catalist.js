window.analyticsCallback = function (state, action) {
  if (!window.__s) {
    if (!window.analyticsCallback.buffer) window.analyticsCallback.buffer = [];
    window.analyticsCallback.buffer.push([state, action]);
    return;
  }

  switch (action.type) {
    case 'AUTH/LOGIN':
      updateUrl();
      var agentId = _.get(action, 'payload.agent.id');
      if(agentId){
        __s.events = "event28";
        __s.visitorID = action.payload.agent.id.replace(/-/g,'');
        setVar('agent id', action.payload.agent.id);
        setVar('startpage', action.payload.agent.startpage);
        setVar('visitor id', __s.visitorID);
        setVar('referrer', document.referrer === '' ? 'direct' : document.referrer);
        __s.tl(null, 'o', 'Login');
      }
      break;
    case 'AGENT_INFO/AGENT_INFO':
      var agentId = _.get(action, 'payload.agent.id');
      if(agentId){
          setVar('agent id', action.payload.agent.id);
          __s.visitorID = action.payload.agent.id.replace(/-/g,'');
        setVar('visitor id', __s.visitorID);
      }
      break;
    case 'AUTH/LOGIN_SEND_CODE':
      updateUrl();
      __s.visitorID = undefined;
      setVar('auth type', 'sms');
      __s.events = "event29";
      __s.tl(null,'o','Send Code Login');
      break;
    case 'BONUS/TAB':
      if (action.payload === 'earn'){
        updateUrl();
        __s.events = 'event30';
        __s.tl(null, 'o', 'Earn bonuses');
      }
      break;
    case 'CALCULATOR/CONFIG':
      if (!action.error) {
            const credit = action.payload.fields[1].settings.promos.find(p => p.type === 'credit');
            if (credit) {
                updateUrl();
                const rate = credit.interestIsFixed ? credit.interestFixed : credit.interestMin;
                __s.events = "event31";
                setVar('interest rate calculator', rate);
                __s.tl(null,'o','Interest Rate Calculator');
            }
        }
        break;
    case 'OTP/CONFIRMED':
        if (window.location.pathname === '/documents'){
            var confirmed = _.get(action, 'payload.confirmed');
            if(confirmed){
                updateUrl();
                __s.events = "event32";
                __s.tl(null,'o','Refund');
            }
        }
        break;
    case 'BONUS/TRANSFER':
        updateUrl();
        __s.events = "event20";
        __s.tl(null,'o','Spend bonuses');
        break;
  }


    function setVar(name, value) {
        const table = {
        'server': 'eVar4',
        'page url': 'eVar6',
        'relative url': 'eVar7',
        'absolut url': 'eVar8',
        'agent id': 'eVar9',
        'visitor id': 'eVar10',
        'interest rate calculator': 'eVar11',
        'startpage': 'eVar12',
        'referrer': 'eVar13',
        'auth type' : 'eVar14'
        };
        var evar = table[name];
        if (!evar) console.error('неизвестная переменная ' + name);
        __s[evar] = value;
    }

    function updateUrl() {
        setVar('server', window.location.hostname);
        setVar('relative url', window.location.pathname.indexOf('/applications/offline') === 0 ? '/applications/offline' : document.location.pathname);
        setVar('absolut url', window.location.href.split('?')[0]);
    }

    if (localStorage.getItem('__ANALYTICS_LOG')) {
        console.log('>>>', action);
    }
}