(function(){
  var ENDPOINTS = {
    FORGOT: 'https://acc.comparehubprices.site/auth/forgot-password',
    RESET: 'https://acc.comparehubprices.site/auth/reset-password',
    RESEND: 'https://acc.comparehubprices.site/auth/resend-forgot-code'
  };

  function getQueryParam(name){
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  async function postJSON(url, payload){
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    });
    var data = await res.json().catch(function(){ return {}; });
    if(!res.ok || data.success === false){
      throw new Error(data.message || ('HTTP ' + res.status));
    }
    return data;
  }

  function bindResetForm(){
    var form = document.getElementById('trpForm');
    if(!form) return;
    var emailEl = document.getElementById('trpEmail');
    var codeEl = document.getElementById('trpCode');
    var passEl = document.getElementById('trpPassword');
    var confirmEl = document.getElementById('trpConfirm');

    var presetEmail = getQueryParam('email');
    if(presetEmail && emailEl) emailEl.value = presetEmail;

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      if(!emailEl || !codeEl || !passEl || !confirmEl) return;
      if(passEl.value !== confirmEl.value){
        alert('Passwords do not match.');
        return;
      }
      try {
        var btn = document.getElementById('trpSubmit');
        if(btn) btn.disabled = true;
        await postJSON(ENDPOINTS.RESET, {
          email: emailEl.value.trim(),
          code: codeEl.value.trim(),
          newPassword: passEl.value
        });
        alert('Password reset successful. You can now sign in.');
        window.location.href = 'login.html';
      } catch(err){
        console.error('Reset error:', err);
        alert('Reset failed. ' + err.message);
      } finally {
        var btn2 = document.getElementById('trpSubmit');
        if(btn2) btn2.disabled = false;
      }
    });
  }

  function bindResend(){
    var resendBtn = document.getElementById('trpResend');
    if(!resendBtn) return;
    resendBtn.addEventListener('click', async function(e){
      e.preventDefault();
      var emailEl = document.getElementById('trpEmail');
      if(!emailEl || !emailEl.value) return;
      try {
        await postJSON(ENDPOINTS.RESEND, { email: emailEl.value.trim() });
        alert('Verification code resent. Please check your inbox.');
      } catch(err){
        console.error('Resend error:', err);
        alert('Could not resend code. ' + err.message);
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ bindResetForm(); bindResend(); });
  } else {
    bindResetForm(); bindResend();
  }
})();
