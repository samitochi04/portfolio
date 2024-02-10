function sendEmail() {
    // Simule l'envoi du courriel (ceci est une démo et non recommandé pour une utilisation réelle)
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Votre backend réel ou un service tiers devrait gérer l'envoi de courriel en utilisant des protocoles sécurisés tels que SMTP.

    // Exemple de sortie pour la démo
    console.log('Courriel envoyé avec succès!');
    console.log('Destinataire:', recipient);
    console.log('Sujet:', subject);
    console.log('Message:', message);
}
