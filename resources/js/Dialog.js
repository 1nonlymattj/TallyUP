function resumeGameDialog(saved) {
    let message = 'Would You Like to Resume the last saved Game?';
    $('<div id = dialog align =center > ' + '<h3>' + message + '</h3>' + '<br>' + ' </div>'
    ).dialog({
        title: 'Resume Last Game',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Confirm': {
                text: 'Yes',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    loadGame(JSON.parse(saved));
                    $(this).dialog('destroy');
                }
            },
            'Close': {
                text: 'No',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    localStorage.removeItem('scoreboardSave');
                    $(this).dialog('destroy');
                }
            }
        }
    });
}

function showFinalScoreDialog() {
  const winner =
    homeTeamRuns > awayTeamRuns ? homeTeam :
    awayTeamRuns > homeTeamRuns ? awayTeam : null;

  const $dialog = $("#finalScoreDialog");

  // Build dialog content
  let content = `
    <div style="font-size:16px; margin-bottom: 10px;">
      <strong>${awayTeam}:</strong> ${awayTeamRuns}<br>
      <strong>${homeTeam}:</strong> ${homeTeamRuns}
    </div>
  `;

  if (winner) {
    content += `<div style="font-size: 18px; font-weight: bold; margin-top: 15px; color: green;">
                  ${winner} WINS!
                </div>`;
  } else {
    content += `<div style="font-size: 18px; font-weight: bold; margin-top: 15px; color: #555;">
                  It's a tie game!
                </div>`;
  }

  $dialog.html(content);

  $dialog.dialog({
    modal: true,
    title: "Final Score",
    buttons: {
      OK: function () {
        $(this).dialog("close");
        location.reload(); // or your future save-game logic
      }
    }
  });
}
