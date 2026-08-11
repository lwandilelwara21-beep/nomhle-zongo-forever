(function () {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  if (!form || !window.SITE_CONFIG) return;

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? '#8f2a2a' : '#24553f';
  }

  function payloadFromForm() {
    const formData = new FormData(form);
    return {
      fullName: String(formData.get('fullName') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      country: String(formData.get('country') || '').trim(),
      interest: String(formData.get('interest') || '').trim(),
      productCategory: String(formData.get('productCategory') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      source: 'Website enquiry',
      createdAt: new Date().toISOString()
    };
  }

  async function submitToWebhook(payload) {
    const endpoint = window.SITE_CONFIG.integration.n8nWebhookUrl;
    if (!endpoint) return false;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    setStatus('Sending your enquiry...');

    const payload = payloadFromForm();

    try {
      const delivered = await submitToWebhook(payload);

      if (delivered) {
        setStatus('Thank you. Your enquiry has been sent successfully.');
        form.reset();
      } else {
        setStatus('Webhook not configured yet. Opening WhatsApp so you can send your enquiry directly.');
        const summary = 'Hi Nomhle, I would like to enquire. Name: ' + payload.fullName + ', Interest: ' + payload.interest + ', Message: ' + payload.message;
        window.open(window.getWhatsAppLink(summary), '_blank', 'noopener');
      }
    } catch (error) {
      setStatus('There was a connection issue. Please use WhatsApp to send your enquiry.', true);
      window.open(window.getWhatsAppLink(window.SITE_CONFIG.whatsappMessages.general), '_blank', 'noopener');
    }
  });
})();
