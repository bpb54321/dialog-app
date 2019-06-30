Feature: Study a dialog

  The app allows a user to study a dialog.

  A dialog is composed of any number of lines, each having a unique number (0 - infinity)

  Each line in the dialog is assigned to a role, which is the character that speaks the line.

  A dialog can have from 1 - infinity roles.

  The dialog study exercise starts by asking a user to pick one role from the possible roles in
  the dialog.

  The app then proceeds line by line, speaking the lines of any non-user roles in the dialog, until
  a line spoken by the user role is reached.

  \When a line spoken by the user role is reached, the user must enter his guess as to what his
  line is. After the user has guessed the content of his line, the app displays the
  user's guess, along with the correct line according to the dialog.

  The app then continues to display the lines of the non-user roles, until it gets to the next user
  line. The app continues in this way until the dialog is over.

  Background:
    Given the app is loaded with the following dialog
      | role        | text                                                                     |
      | Mme Colbert | Qu'est-ce que tu as envie de manger demain midi?                         |
      | M Colbert   | Je ne sais pas, c'est comme tu veux.                                     |
      | Mme Colbert | C'est toujours moi qui doit choisir. Un rosbif-haricots verts, ca te va? |
      | M Colbert   | Tres bien.                                                               |



  Scenario: The user picks a role
    When the user selects "Role 0"
    Then "User Role: Role 0" should be displayed

  Scenario: The user guesses his lines
    Given the user selects the role of Mme Colbert
    And the user is prompted to guess her first line
    When the user guesses "Qu'est ce que tu veux manger demain midi"?
    Then the app displays the user's guess, along with the correct text for the line

  
