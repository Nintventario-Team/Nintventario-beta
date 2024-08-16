Feature: Contact Us Form

  Scenario: Send a contact email
    When I send a contact email with subject "Inquiry" and message "I need help with my order."
    Then I should receive a "200" status
    And I should see a confirmation message "Correo enviado exitosamente"
