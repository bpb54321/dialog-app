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

  Scenario: The user picks a role
    Given the app is loaded with a dialog which has the roles ""Role 0", "Role 1"
    When the user selects "Role 0"
    Then "User Role: Role 0" should be displayed

  Scenario: The user guesses his lines
    Given the app is loaded with a dialog
    And the user is prompted to guess his line
    When The user submits a guess for his first line
    Then the app displays the user's guess, along with the correct text for the line

  
