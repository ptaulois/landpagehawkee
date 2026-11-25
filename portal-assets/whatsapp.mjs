// Only called after an administrator explicitly chooses to open WhatsApp.
export function whatsappRecipient(phone) {
  if (typeof phone !== 'string' || !/^\+?[1-9]\d{7,14}$/.test(phone)) return null;
  return phone.replace(/^\+/, '');
}
export function welcomeMessage({name, email, password}) {
  return `Olá, ${name}! Seja bem-vindo(a) à Hawkee Construtora.

Seu acesso ao Portal do Cliente está pronto. Por lá, você poderá acompanhar as etapas, fotos e atualizações da sua obra.

Portal: https://hawkeesc.com.br/portal.html
E-mail: ${email}
Senha temporária: ${password}

No primeiro acesso, troque a senha temporária por uma senha de sua escolha.

Obrigado por confiar na Hawkee para construir seu projeto!`;
}
export function whatsappUrl(phone, message) {
  const recipient = whatsappRecipient(phone);
  if (!recipient || typeof message !== 'string' || !message.trim()) return null;
  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}
