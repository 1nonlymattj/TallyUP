function addPlayer() {
  const nameInput = document.getElementById('playerName');
  const posSelect = document.getElementById('playerPosition');

  const name = nameInput.value.trim();
  const pos = posSelect.value;

  if (!name || !pos) return;

  const player = { name, position: pos, history: [] };

  if (selectedTeam === 'home') homePlayers.push(player);
  else awayPlayers.push(player);

  nameInput.value = '';
  posSelect.selectedIndex = 0;

  renderPlayerList();
  renderLineupPreview();
}

function renderPlayerList() {
  const homeList = document.getElementById('homeLineupPreview');
  const awayList = document.getElementById('awayLineupPreview');

  // Clear both lists
  homeList.innerHTML = '';
  awayList.innerHTML = '';

  // Render home players
  homePlayers.forEach((player, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${player.name} 
      - <select class="playerInput" onchange="editPlayer(${index}, this.value, 'home')">
        ${["P","C","1B","2B","3B","SS","LF","LC","RC","RF","EH","CF", "5th Man"].map(
          pos => `<option value="${pos}" ${player.position === pos ? "selected" : ""}>${pos}</option>`
        ).join('')}
      </select>
      <button onclick="removePlayer(${index}, 'home')">❌</button>
    `;
    homeList.appendChild(li);
  });

  // Render away players
  awayPlayers.forEach((player, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${player.name} 
      - <select class="playerInput" onchange="editPlayer(${index}, this.value, 'away')">
        ${["P","C","1B","2B","3B","SS","LF","LC","RC","RF","EH","CF", "5th Man"].map(
          pos => `<option value="${pos}" ${player.position === pos ? "selected" : ""}>${pos}</option>`
        ).join('')}
      </select>
      <button onclick="removePlayer(${index}, 'away')">❌</button>
    `;
    awayList.appendChild(li);
  });

  // Make them sortable again
  Sortable.create(homeList, { animation: 150 });
  Sortable.create(awayList, { animation: 150 });
}

function renderLineupPreview() {
  const homeList = document.getElementById('homeLineupPreview');
  const awayList = document.getElementById('awayLineupPreview');
  const container = document.getElementById('lineupPreviewContainer');

  // Set team names
  document.getElementById('homeTeamNamePreview').innerText = homeTeam || "Home";
  document.getElementById('awayTeamNamePreview').innerText = awayTeam || "Away";
  document.getElementById('homeLineupBtn').innerText = `${homeTeam} Lineup`;
  document.getElementById('awayLineupBtn').innerText = `${awayTeam} Lineup`;

  // Clear lists
  homeList.innerHTML = '';
  awayList.innerHTML = '';

  // Home Lineup
  homePlayers.forEach((player, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${player.name} 
      - <select class="playerInput" onchange="editPlayer(${index}, this.value, 'home')">
        ${["P","C","1B","2B","3B","SS","LF","LC","RC","RF","EH","CF", "5th Man"].map(
          pos => `<option value="${pos}" ${player.position === pos ? "selected" : ""}>${pos}</option>`
        ).join('')}
      </select>
      <button onclick="removePlayer(${index}, 'home')">❌</button>
    `;
    homeList.appendChild(li);
  });

  // Away Lineup
  awayPlayers.forEach((player, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${player.name} 
      - <select class="playerInput" onchange="editPlayer(${index}, this.value, 'away')">
        ${["P","C","1B","2B","3B","SS","LF","LC","RC","RF","EH","CF", "5th Man"].map(
          pos => `<option value="${pos}" ${player.position === pos ? "selected" : ""}>${pos}</option>`
        ).join('')}
      </select>
      <button onclick="removePlayer(${index}, 'away')">❌</button>
    `;
    awayList.appendChild(li);
  });

  // Show or hide container
  const hasLineups = homePlayers.length || awayPlayers.length;
  container.style.display = hasLineups ? 'block' : 'none';

  // Show/hide buttons
  document.getElementById('homeLineupBtn').style.display = homePlayers.length ? 'inline-block' : 'none';
  document.getElementById('awayLineupBtn').style.display = awayPlayers.length ? 'inline-block' : 'none';

  // Make both previews sortable
  Sortable.create(homeList, { animation: 150 });
  Sortable.create(awayList, { animation: 150 });
}

function editPlayer(index, value, team) {
  const teamPlayers = team === 'home' ? homePlayers : awayPlayers;
  teamPlayers[index].position = value;
}

function removePlayer(index, team) {
  const teamPlayers = team === 'home' ? homePlayers : awayPlayers;
  teamPlayers.splice(index, 1);
  renderPlayerList();
  renderLineupPreview();
}

function startGame() {
    homeTeam = document.getElementById('homeTeam').value || "Home";
    awayTeam = document.getElementById('awayTeam').value || "Away";
    maxInnings = parseInt(document.getElementById('inningSelect').value);
    document.querySelector('.setup').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.getElementById('homeTeamLabel').innerText = homeTeam;
    document.getElementById('awayTeamLabel').innerText = awayTeam;
    document.getElementById('lineupPreviewContainer').style.display = 'none';
    document.getElementById('lineupButtonsContainer').style.display = 'block';
    document.getElementById('homeLineupViewBtn').onclick = () => showLineupModal('home');
    document.getElementById('awayLineupViewBtn').onclick = () => showLineupModal('away');

    const hasHomeLineup = homePlayers.length > 0;
    const hasAwayLineup = awayPlayers.length > 0;

    document.getElementById('manualInningEntry').style.display = (!hasHomeLineup && !hasAwayLineup) ? 'block' : 'none';
    updateFieldInterfaceVisibility();

    // Hide player stats if home team has no players
    const isHomeBatting = half === 'bottom';
    const currentLineup = isHomeBatting ? homePlayers : awayPlayers;

    if (!currentLineup.length) {
        document.getElementById('playerStatsTable').style.display = 'none';
        document.getElementById('batterInfo').style.display = 'none';
    } else {
        document.getElementById('playerStatsTable').style.display = 'table';
        document.getElementById('batterInfo').style.display = 'block';
    }

    startHalfInningScore = (half === 'bottom') ? homeTeamRuns : awayTeamRuns;

    updateStealButtonVisibility();
    updateScoreStatus();
    updatePlayerStatsTable();
    updateBatterDisplay();
    renderBoxScoreOnce(maxInnings); // <-- This fixes the missing table

}

function updateBatterDisplay() {
  const currentPlayer = (half === 'top' ? awayPlayers : homePlayers)[batterIndex % (half === 'top' ? awayPlayers.length : homePlayers.length)];
  document.getElementById('batterInfo').innerText = currentPlayer ? `Batter: ${currentPlayer.name}` : '';
}

function recordPlay(type) {
    const currentPlayer = (half === 'top' ? awayPlayers : homePlayers)[batterIndex % (half === 'top' ? awayPlayers.length : homePlayers.length)];
    if (!currentPlayer) return;

    if (type === 'K') {
        outs++;
        updateOuts();
        if (outs >= 3) {
            endHalfInning();
            return;
        }
    } else if (type === 'OUT') {
        const runnersOnBase = bases.some(base => base);

        if (outs < 2 && runnersOnBase) {
            showInteractiveOutModal(); // Show modal only if fewer than 2 outs
            return; // Wait for modal interaction
        } else {
            outs++;
            updateOuts();
            if (outs >= 3) {
            endHalfInning();
            return;
            }
        }
    } else {
        advanceRunners(type);
    }

    batterIndex++;
    updateStealButtonVisibility()
    updatePlayerStatsTable();
    updateBatterHistory();
    updateBatterDisplay();
}

function advanceRunners(type) {
  if (type === 'BB') {
    // BB logic stays untouched
    if (bases[0] && bases[1] && bases[2]) {
      if (half === 'bottom') homeTeamRuns++;
      else awayTeamRuns++;

      bases[2] = bases[1];
      bases[1] = bases[0];
      bases[0] = true;
    } else {
      if (bases[1] && bases[0] && !bases[2]) {
        bases[2] = true;
        bases[1] = false;
      }
      if (bases[0] && !bases[1]) {
        bases[1] = true;
        bases[0] = false;
      }
      if (!bases[0]) {
        bases[0] = true;
      }
    }

    updateBasesAnimated();
    updateScoreStatus();

    // Push BB to batter stats
    const batter = (half === 'top' ? awayPlayers : homePlayers)[batterIndex % (half === 'top' ? awayPlayers.length : homePlayers.length)];
    batter.history.push('BB');
    batterStats.push({ name: batter.name, result: 'BB' });


    return; // Don't show advance modal
  }

  // For hits with runners
  const advancement = { '1B': 1, '2B': 2, '3B': 3, 'HR': 4 }[type] || 0;
  const hasRunners = bases.some(b => b);

  if (advancement < 4 && hasRunners) {
    pendingHitType = type;
    runnersAdvancingForHit = true;
    showInteractiveOutModal(true); // show modal for runner advancement
    return;
  }

  applyBatterAdvance(type); // default fallback if no runners or HR
}

function applyBatterAdvance(type) {
  const advancement = { '1B': 1, '2B': 2, '3B': 3, 'HR': 4 }[type] || 0;
  const isHomeBatting = half === 'bottom';
  const players = isHomeBatting ? homePlayers : awayPlayers;
  const batter = players[batterIndex % players.length]; 

  const addRun = () => {
    if (isHomeBatting) homeTeamRuns++;
    else awayTeamRuns++;
  };

  let rbis = 0;

  if (advancement === 4) {
    // HR: all runners score
    for (let i = 2; i >= 0; i--) {
      if (bases[i]) {
        addRun();
        bases[i] = false;
        rbis++;
      }
    }
    addRun(); // Batter scores
    batter.history.push('HR');
    batterStats.push({ name: batter.name, result: 'HR', rbis: rbis + 1 });
  } else if (advancement > 0) {
    bases[advancement - 1] = true;
    batter.history.push(type);
    batterStats.push({ name: batter.name, result: type, rbis: 0 }); // RBI will be handled via runner dialog
  }

  updateBasesAnimated();
  updateScoreStatus();

  pendingHitType = null;
  runnersAdvancingForHit = false;
}

function showOutAdvanceModal() {
  document.getElementById('advanceModal').style.display = 'block';
}

function showInteractiveOutModal(isHit = false) {
  const modal = document.getElementById('interactiveOutModal');
  const container = document.getElementById('baseOutOptions');
  container.innerHTML = '';

  const hitType = pendingHitType || null;
  const hitAdv = { '1B': 1, '2B': 2, '3B': 3, 'HR': 4 }[hitType] || 0;

  bases.forEach((player, index) => {
    if (!player) return;

    let advanceOptions = '';
    const baseLabel = ['1st Base', '2nd Base', '3rd Base'][index];

    // Logic for hit-based advance rules
    if (isHit) {
      if (hitAdv === 1) {
        if (index === 0) {
        advanceOptions = `
          <option value="1">2nd Base</option>
          <option value="2">3rd Base</option>
          <option value="3">Home</option>
        `;
        } else if (index === 1) {
        advanceOptions = `
          <option value="2">3rd Base</option>
          <option value="3">Home</option>
        `;
        } else if (index === 2) {
        advanceOptions = `
          <option value="3">Home</option>
        `;
        } 
      } else if (hitAdv === 2) {
        if (index === 0) {
          advanceOptions = `
            <option value="2">3rd Base</option>
            <option value="3">Home</option>
          `;
        } else if (index === 1) {
          advanceOptions = `<option value="3">Home</option>`;
        }
      } else if (hitAdv === 3) {
        if (index === 0 || index === 1 || index === 2) {
          advanceOptions = `<option value="3">Home</option>`;
        }
      }
    } else {
      // For outs or manual modes
      advanceOptions = `
        <option value="1">1st Base</option>
        <option value="2">2nd Base</option>
        <option value="3">3rd Base</option>
      `;
    }

    const label = document.createElement('label');
    label.innerHTML = `
      <strong>${baseLabel}</strong><br>
      Outcome:
      <select class="baseOutcome" data-base="${index}">
        <option value="">Select</option>
        <option value="advance">Advance</option>
        <option value="out">Out</option>
        <option value="Didn't Advance">Did Not Advance</option>
      </select>
      <br>
      If Advance, how far?
      <select class="baseAdvance" data-base="${index}" disabled>
        <option value="">Select</option>
        ${advanceOptions}
      </select>
      <br><br>
    `;
    container.appendChild(label);
  });

  const batterOutCheckbox = document.getElementById('batterOutCheckbox');
  batterOutCheckbox.checked = false;
  batterOutCheckbox.style.display = isHit ? 'inline-block' : 'inline-block';
  document.getElementById('interactiveOutSubmit').disabled = true;

  modal.style.display = 'block';

  container.querySelectorAll('.baseOutcome').forEach(select => {
    select.addEventListener('change', (e) => {
      const baseIndex = e.target.dataset.base;
      const advSelect = container.querySelector(`.baseAdvance[data-base="${baseIndex}"]`);
      if (e.target.value === 'advance') {
        advSelect.disabled = false;
      } else {
        advSelect.disabled = true;
        advSelect.value = '';
      }
      validateInteractiveModalSubmit();
    });
  });

  container.querySelectorAll('.baseAdvance').forEach(select => {
    select.addEventListener('change', validateInteractiveModalSubmit);
  });
}

function closeInteractiveOutModal() {
  document.getElementById('interactiveOutModal').style.display = 'none';
}

function validateInteractiveModalSubmit() {
  const outcomeSelects = document.querySelectorAll('.baseOutcome');
  const advanceSelects = document.querySelectorAll('.baseAdvance');

  let valid = true;

  outcomeSelects.forEach(select => {
    if (select.value === '') valid = false;
  });

  advanceSelects.forEach(select => {
    if (!select.disabled && select.value === '') valid = false;
  });

  document.getElementById('interactiveOutSubmit').disabled = !valid;
}

function submitInteractiveOut() {
    let newOuts = 0;
    const outcomeSelects = document.querySelectorAll('.baseOutcome');
    const advanceSelects = document.querySelectorAll('.baseAdvance');
    const batterOut = document.getElementById('batterOutCheckbox').checked;

    const runnersToAdvance = [];
    const runnersOut = [];

    outcomeSelects.forEach(select => {
        const baseIndex = parseInt(select.dataset.base);
        const result = select.value;

        if (result === 'out') {
        runnersOut.push(baseIndex);
        bases[baseIndex] = null;
        newOuts++;
        } else if (result === 'advance') {
        const distance = parseInt(document.querySelector(`.baseAdvance[data-base="${baseIndex}"]`).value);
        if (distance > 0) {
            runnersToAdvance.push({ from: baseIndex, to: baseIndex + distance });
            bases[baseIndex] = null;
        }
        }
    });

    if (batterOut) newOuts++;

    const totalOuts = outs + newOuts;

    // Process runner advancements
    // Process runner advancements (advance runners before animating)
    runnersToAdvance.sort((a, b) => b.from - a.from).forEach(({ from, to }) => {
      bases[from] = false;

      const isScoring = to >= 3;
      const inningWillEnd = totalOuts >= 3;

      if (isScoring) {
        if (!inningWillEnd || (outs + runnersOut.length < 3)) {
          if (half === 'bottom') homeTeamRuns++;
          else awayTeamRuns++;

          // Only count RBI for batter when scoring occurs
          if (runnersAdvancingForHit && pendingHitType) {
            const batter = (half === 'top' ? awayPlayers : homePlayers)[batterIndex % (half === 'top' ? awayPlayers.length : homePlayers.length)];
            const stat = batterStats.find(stat => stat.name === batter.name && stat.result === pendingHitType);
            if (stat) stat.rbis = (stat.rbis || 0) + 1;
          }
        }
      } else {
        bases[to] = true;
        animateRunner(from, to); // Animate non-scoring runner
      }
    });


    outs = outs + newOuts;
    updateOuts();
    updateScoreStatus();

    // Delay base light-up to sync with animation
    if (outs >= 3) {
        endHalfInning(); // inning reset will clear bases
    } else {
        setTimeout(updateBasesAnimated, 500); // allow animation to complete
    }

    updatePlayerStatsTable();

    if (runnersAdvancingForHit && pendingHitType) {
        const batter = (half === 'top' ? awayPlayers : homePlayers)[batterIndex % (half === 'top' ? awayPlayers.length : homePlayers.length)];

        const baseOuts = Array.from(document.querySelectorAll('.baseOutcome'))
            .map(sel => sel.value)
            .filter(v => v === 'out').length;

        const isFielderChoice = pendingHitType === '1B' && baseOuts > 0;

        if (isFielderChoice) {
            batter.history.push('FC');
            batterStats.push({ name: batter.name, result: 'FC' });
        } else {
            batter.history.push(pendingHitType);
            batterStats.push({ name: batter.name, result: pendingHitType });
        }

        const batterOut = document.getElementById('batterOutCheckbox').checked;
        if (!batterOut) {
            applyBatterAdvance(pendingHitType);
        }

        updatePlayerStatsTable();
        updateBatterHistory();
        updateBatterDisplay();

        batterIndex++;
        updateStealButtonVisibility();
    }

    closeInteractiveOutModal();
}

function confirmOutAdvance() {
  document.getElementById('advanceModal').style.display = 'none';

  const advBase1 = document.getElementById('advBase1').checked;
  const advBase2 = document.getElementById('advBase2').checked;
  const advBase3 = document.getElementById('advBase3').checked;

  // Advance runners manually
  if (advBase3 && bases[2]) {
    if (half === 'bottom') {
      homeTeamRuns++;
    } else {
      awayTeamRuns++;
    }
    bases[2] = false;
  }

  if (advBase2 && bases[1]) {
    if (!bases[2]) {
      bases[2] = true;
      bases[1] = false;
    }
  }

  if (advBase1 && bases[0]) {
    if (!bases[1]) {
      bases[1] = true;
      bases[0] = false;
    }
  }

  outs++;
  updateOuts();
  if (outs >= 3) {
    endHalfInning();
    return;
  }

  updateBasesAnimated();
  updatePlayerStatsTable();

  // Reset modal inputs
  ['advBase1', 'advBase2', 'advBase3'].forEach(id => {
    document.getElementById(id).checked = false;
  });
}

function updateBasesAnimated() {
  const baseElems = ['base1', 'base2', 'base3'];

  baseElems.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active');
    if (bases[i]) {
      setTimeout(() => el.classList.add('active'), 100);
    }
  });
}

function showStealDialog() {
  const stealModal = document.getElementById('stealModal');
  const container = document.getElementById('stealOptionsContainer');
  container.innerHTML = ''; // clear previous

  bases.forEach((occupied, baseIndex) => {
    if (!occupied) return;

    const nextBase = baseIndex + 1;
    const baseName = ['1st', '2nd', '3rd'][baseIndex];
    const targetName = ['2nd', '3rd', 'Home'][baseIndex];

    const row = document.createElement('div');
    row.className = 'steal-row';
    row.innerHTML = `
      <strong>${baseName} → ${targetName}</strong><br>
      Result: 
      <select class="steal-result" data-base="${baseIndex}">
        <option value="">Select</option>
        <option value="safe">Safe</option>
        <option value="out">Caught Stealing</option>
      </select>
      <br><br>
    `;
    container.appendChild(row);
  });

  stealModal.style.display = 'block';
}

function submitSteal() {
  const selects = document.querySelectorAll('.steal-result');
  let newOuts = 0;

  selects.forEach(select => {
    const baseIndex = parseInt(select.dataset.base);
    const result = select.value;

    if (!result || isNaN(baseIndex)) return;

    if (result === 'safe') {
      if (baseIndex === 2) {
        // 3rd → Home = Run!
        if (bases[2]) {
          if (half === 'bottom') {
            homeTeamRuns++;
          } else {
            awayTeamRuns++;
          }
          bases[2] = false;
        }
      } else {
        // Advance to next base if it's free
        if (!bases[baseIndex + 1]) {
          bases[baseIndex + 1] = true;
          bases[baseIndex] = false;
        }
      }
    } else if (result === 'out') {
      if (bases[baseIndex]) {
        bases[baseIndex] = false;
        newOuts++;
      }
    }
  });

  outs += newOuts;
  updateOuts();
  updateScoreStatus();
  updateBasesAnimated();
  updateStealButtonVisibility();

  if (outs >= 3) {
    endHalfInning();
  }

  closeStealModal();
}

function closeStealDialog() {
  document.getElementById('stealModal').style.display = 'none';
}

function maybeShowStealButton() {
  const hasRunners = bases.some(b => b);
  document.getElementById('stealButton').style.display = hasRunners ? 'inline-block' : 'none';
}

function updateStealButtonVisibility() {
  const stealsEnabled = document.getElementById('stealsAllowed').checked;
  const runnersOnBase = bases.some(b => b);
  const stealBtn = document.getElementById('stealButton');

  if (stealsEnabled && runnersOnBase) {
    stealBtn.style.display = 'inline-block';
  } else {
    stealBtn.style.display = 'none';
  }
}

function updateOuts() {
  const outEls = document.querySelectorAll('.out');
  outEls.forEach((el, i) => {
    el.classList.toggle('active', i < outs);
  });
}

function updateScoreStatus() {
  const awaySpan = document.getElementById('awayScoreDisplay');
  const homeSpan = document.getElementById('homeScoreDisplay');

  awaySpan.innerText = `${awayTeam}: ${awayTeamRuns}`;
  homeSpan.innerText = `${homeTeam}: ${homeTeamRuns}`;

  if (awayTeamRuns > homeTeamRuns) {
    awaySpan.style.color = 'green';
    homeSpan.style.color = 'red';
  } else if (homeTeamRuns > awayTeamRuns) {
    homeSpan.style.color = 'green';
    awaySpan.style.color = 'red';
  } else {
    homeSpan.style.color = 'black';
    awaySpan.style.color = 'black';
  }
}

function updateBatterHistory() {
  const table = document.getElementById('batterHistoryList');
  table.innerHTML = '';

  const currentTeam = half === 'top' ? awayPlayers : homePlayers;
  const batter = currentTeam[batterIndex % currentTeam.length];
  if (!batter) return;

  const history = batter.history;

  const count = (type) => history.filter(r => r === type).length;
  const ABs = history.filter(r => !['BB'].includes(r)).length;

  const rowHTML = `
    <table>
      <thead>
        <tr>
          <th>PLAYER</th>
          <th>ABs</th>
          <th>1Bs</th>
          <th>2Bs</th>
          <th>3Bs</th>
          <th>HRs</th>
          <th>FC</th>
          <th>Ks</th>
          <th>BBs</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${batter.name}</td>
          <td>${ABs}</td>
          <td>${count('1B')}</td>
          <td>${count('2B')}</td>
          <td>${count('3B')}</td>
          <td>${count('HR')}</td>
          <td>${count('FC')}</td>
          <td>${count('K')}</td>
          <td>${count('BB')}</td>
        </tr>
      </tbody>
    </table>
  `;

  table.innerHTML = rowHTML;
}

function addInningColumn(inningNum, isExtra = false) {
  const th = document.createElement('th');
  th.innerText = inningNum;
  if (isExtra) th.classList.add('extra-inning');
  document.getElementById('boxScoreHeader').appendChild(th);

  ['away', 'home'].forEach(team => {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.setAttribute('data-inning', inningNum);
    input.setAttribute('data-team', team);

    // Restore from boxScore if previously saved
    const halfKey = team === 'away' ? 'top' : 'bottom';
    const key = `${inningNum - 1}-${halfKey}`;
    const saved = boxScore?.[team]?.[key];

    if (saved !== undefined) {
      input.value = saved;
      input.disabled = true;
      input.classList.add('locked-in');
      input.addEventListener('blur', onBoxScoreInputBlur);
    }

    td.appendChild(input);
    document.getElementById(team + 'Row').appendChild(td);
  });
}

function renderBoxScoreOnce(maxInnings = 7) {
  const table = document.getElementById('boxScoreTable');
  table.innerHTML = '';

  // ===== Header Row =====
  const header = document.createElement('tr');
  header.id = 'boxScoreHeader';
  header.innerHTML = `<th>Team</th>`;
  for (let i = 1; i <= maxInnings; i++) {
    const th = document.createElement('th');
    th.innerText = i;
    header.appendChild(th);
  }
  table.appendChild(header);

  // ===== Team Rows =====
  ['away', 'home'].forEach(team => {
    const row = document.createElement('tr');
    row.id = `${team}BoxRow`;

    const teamName = team === 'away' ? awayTeam : homeTeam;
    row.innerHTML = `<td>${teamName}</td>`;

    for (let i = 0; i < maxInnings; i++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.classList.add('box-input');
      input.dataset.team = team;
      input.dataset.inning = i + 1;
      input.addEventListener('blur', onBoxScoreInputBlur);

      const halfKey = team === 'home' ? 'bottom' : 'top';
      const key = `${i}-${halfKey}`;
      const saved = boxScore?.[team]?.[key];

      if (saved !== undefined) {
        input.value = saved;
        input.disabled = true;
        input.classList.add('locked-in');
      }

      td.appendChild(input);
      row.appendChild(td);
    }

    table.appendChild(row);
  });
}

function updateBoxScoreCell(teamKey, inningKey, runsScored) {
  const input = document.querySelector(`input[data-team="${teamKey}"][data-inning="${inningKey}"]`);
  if (input) {
    input.value = runsScored;
    input.disabled = true;
    input.classList.add('locked-in');
    input.addEventListener('blur', onBoxScoreInputBlur);
  }
}

function maybeAddExtraInning() {
  const isFinalRegInning = (inning === maxInnings);
  const isBottomHalf = (half === 'top'); // This means we just *completed* a bottom half

  if (!isFinalRegInning || !isBottomHalf) return;

  const isTied = homeTeamRuns === awayTeamRuns;
  if (!isTied) return;

  // Game is tied after full regulation innings — add 1 extra inning
  maxInnings++; // Extend max innings by 1

  // Add an extra column to the box score table
  addExtraInningColumn(maxInnings - 1); // zero-indexed
}

function addExtraInningColumn(inningIndex) {
  const headerRow = document.querySelector('#boxScoreTable thead tr');
  const homeRow = document.querySelector('#boxScoreTable tbody tr.home');
  const awayRow = document.querySelector('#boxScoreTable tbody tr.away');

  // Add new header
  const th = document.createElement('th');
  th.innerText = (inningIndex + 1).toString();
  headerRow.appendChild(th);

  // Add new home cell
  const homeCell = document.createElement('td');
  homeCell.innerHTML = `<input type="number" data-team="home" data-inning="${inningIndex}" class="box-input" disabled>`;
  homeRow.appendChild(homeCell);

  // Add new away cell
  const awayCell = document.createElement('td');
  awayCell.innerHTML = `<input type="number" data-team="away" data-inning="${inningIndex}" class="box-input" disabled>`;
  awayRow.appendChild(awayCell);
}

function updatePlayerStatsTable() {
  const tableBody = document.querySelector('#playerStatsTable tbody');
  const tableHead = document.querySelector('#playerStatsHeader');
  const showAdvanced = document.getElementById('toggleAdvancedStats')?.checked;

  tableBody.innerHTML = '';
  tableHead.innerHTML = '';

  const currentBattingPlayers = half === 'top' ? awayPlayers : homePlayers;

  // Build header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>PLAYER</th>
    <th>ABs</th>
    <th>H</th>
    ${showAdvanced ? `
      <th>1B</th>
      <th>2B</th>
      <th>3B</th>
      <th>HR</th>
      <th>FC</th>
    ` : `
      <th>HR</th>
    `}
    <th>K</th>
    <th>BB</th>
    ${showAdvanced ? `
      <th>RBIs</th>
      <th>TB</th>
      <th>SLG</th>
      <th>OBP</th>
    ` : ''}
    <th>AVG</th>
  `;
  tableHead.appendChild(headerRow);

  currentBattingPlayers.forEach(player => {
    const history = player.history || [];

    const singles = history.filter(r => r === '1B').length;
    const doubles = history.filter(r => r === '2B').length;
    const triples = history.filter(r => r === '3B').length;
    const hrs = history.filter(r => r === 'HR').length;
    const fcs = history.filter(r => r === 'FC').length;
    const bbs = history.filter(r => r === 'BB').length;
    const ks = history.filter(r => r === 'K').length;

    const hits = singles + doubles + triples + hrs;
    const atBats = history.filter(r => !['BB'].includes(r)).length;

    const playerRBIs = batterStats
      .filter(e => e.name === player.name && e.rbis)
      .reduce((sum, e) => sum + e.rbis, 0);

    const totalBases = singles + (doubles * 2) + (triples * 3) + (hrs * 4);
    const avg = atBats > 0 ? (hits / atBats).toFixed(3) : '0.000';
    const slg = atBats > 0 ? (totalBases / atBats).toFixed(3) : '0.000';
    const obp = (atBats + bbs) > 0 ? ((hits + bbs) / (atBats + bbs)).toFixed(3) : '0.000';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${player.name}</td>
      <td>${atBats}</td>
      <td>${hits}</td>
      ${showAdvanced ? `
        <td>${singles}</td>
        <td>${doubles}</td>
        <td>${triples}</td>
        <td>${hrs}</td>
        <td>${fcs}</td>
      ` : `
        <td>${hrs}</td>
      `}
      <td>${ks}</td>
      <td>${bbs}</td>
      ${showAdvanced ? `
        <td>${playerRBIs}</td>
        <td>${totalBases}</td>
        <td>${slg}</td>
        <td>${obp}</td>
      ` : ''}
      <td>${avg}</td>
    `;
    tableBody.appendChild(row);
  });
}

function showLineupModal(team) {
  const homeList = document.getElementById('homeLineupList');
  const awayList = document.getElementById('awayLineupList');
  const homeHeader = document.getElementById('lineupHomeTeamName');
  const awayHeader = document.getElementById('lineupAwayTeamName');

  // Clear lists
  homeList.innerHTML = '';
  awayList.innerHTML = '';

  // Hide or show containers based on team argument
  if (team === 'home') {
    homeList.parentElement.style.display = 'block';
    awayList.parentElement.style.display = 'none';
  } else if (team === 'away') {
    homeList.parentElement.style.display = 'none';
    awayList.parentElement.style.display = 'block';
  }

  // Set team names
  homeHeader.innerText = homeTeam;
  awayHeader.innerText = awayTeam;

  // Helper function for stats
  function formatStats(player) {
    const hits = player.history.filter(r => ['1B', '2B', '3B', 'HR'].includes(r)).length;
    const hrs = player.history.filter(r => r === 'HR').length;
    const bbs = player.history.filter(r => r === 'BB').length;
    const atBats = player.history.filter(r => !['BB'].includes(r)).length;
    const avg = atBats > 0 ? (hits / atBats).toFixed(3) : '0.000';
    return `Hits: ${hits}, HR: ${hrs}, BB: ${bbs}, AVG: ${avg}`;
  }

  // Render the selected team lineup
  if (team === 'home') {
    homePlayers.forEach(player => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${player.name}</strong> (${player.position})<br><small>${formatStats(player)}</small>`;
      homeList.appendChild(li);
    });
  } else if (team === 'away') {
    awayPlayers.forEach(player => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${player.name}</strong> (${player.position})<br><small>${formatStats(player)}</small>`;
      awayList.appendChild(li);
    });
  }

  // Open the dialog
  $("#lineupModal").dialog("open");
}

function animateInningChange() {
  const el = document.getElementById('inningDisplay');
  el.classList.add('highlight-inning');
  setTimeout(() => el.classList.remove('highlight-inning'), 600);
}

function endHalfInning() {
    const wasBottom = (half === 'bottom'); // Save current half BEFORE flipping
    const teamKey = wasBottom ? 'home' : 'away';
    const scoreNow = teamKey === 'home' ? homeTeamRuns : awayTeamRuns;

    const inningKey = inning; // zero-indexed
    const halfKey = half; // current half being ended

    const key = `${inningKey}-${halfKey}`;
    const runsScored = scoreNow - startHalfInningScore;

    // Save to boxScore object
    boxScore[teamKey][key] = runsScored;

    // Update just the score cell
    updateBoxScoreCell(teamKey, inningKey, runsScored);

    // Reset field state
    outs = 0;
    bases = [false, false, false];
    updateOuts();
    updateBasesAnimated();
    updatePlayerStatsTable();

    // Flip half-inning
    half = half === 'top' ? 'bottom' : 'top';

    // If flipping from bottom to top, increment inning
    if (half === 'top') {
        inning++;
    }

    // Save the new starting score for the next half-inning
    startHalfInningScore = (half === 'top') ? awayTeamRuns : homeTeamRuns;

    // Update display
    document.getElementById('inningDisplay').innerText = `Inning: ${inning} (${half === 'top' ? 'Top' : 'Bottom'})`;

    // Handle extra innings if tied after bottom half
    maybeAddExtraInning();

    // Update the current batter display
    updateBatterDisplay();
    updateFieldInterfaceVisibility();
}

function endGame() {
  const isDoubleHeader = document.getElementById('doubleHeaderCheckbox').checked;

    if (isDoubleHeader && !window.doubleHeaderPlayed) {
        window.doubleHeaderPlayed = true;

        // Swap teams
        [homeTeam, awayTeam] = [awayTeam, homeTeam];
        [homePlayers, awayPlayers] = [awayPlayers, homePlayers];

        // Update UI
        document.getElementById('homeTeamLabel').innerText = homeTeam;
        document.getElementById('awayTeamLabel').innerText = awayTeam;
        document.getElementById('homeLineupBtn').innerText = `${homeTeam} Lineup`;
        document.getElementById('awayLineupBtn').innerText = `${awayTeam} Lineup`;

        // Show reorder modal
        showDoubleHeaderModal();
        return;
    }
    location.reload();
}

function onBoxScoreInputBlur(event) {
    const input = event.target;
    const val = parseInt(input.value);
    if (isNaN(val) || val < 0 || input.disabled) return;

    const team = input.dataset.team;
    const inningNum = parseInt(input.dataset.inning);
    const halfKey = team === 'home' ? 'bottom' : 'top';
    const key = `${inningNum}-${halfKey}`;

    // Save to boxScore object
    if (!boxScore[team]) boxScore[team] = {};
    boxScore[team][key] = val;

    // Update team total score
    if (team === 'home') {
        homeTeamRuns = Object.values(boxScore['home'] || {}).reduce((a, b) => a + b, 0);
    } else {
        awayTeamRuns = Object.values(boxScore['away'] || {}).reduce((a, b) => a + b, 0);
    }

    updateScoreStatus();

    // Lock the input after editing
    input.disabled = true;
    input.classList.add('locked-in');

    animateInningChange();

    // ---- EXTRA INNING CHECK LOGIC ----
    const wasBottomHalf = team === 'home';
    const isFinalScheduledInning = (inningNum === maxInnings);

    if (wasBottomHalf && isFinalScheduledInning) {
        const isTied = homeTeamRuns === awayTeamRuns;

        if (isTied) {
        // Only add one extra inning at a time
        maxInnings++;

        // Dynamically add new column to box score table
        const newInningNum = maxInnings;
        const header = document.getElementById('boxScoreTable').querySelector('tr'); // inning header row
        const awayRow = document.getElementById('awayBoxRow');
        const homeRow = document.getElementById('homeBoxRow');

        // Add new column to header
        const th = document.createElement('th');
        th.innerText = newInningNum;
        th.classList.add('extra-inning');
        header.appendChild(th);

        // Add new inputs for both teams
        ['away', 'home'].forEach(t => {
            const row = document.getElementById(`${t}BoxRow`);
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.setAttribute('data-team', t);
            input.setAttribute('data-inning', newInningNum);
            input.classList.add('box-input');
            input.addEventListener('blur', onBoxScoreInputBlur);

            const td = document.createElement('td');
            td.appendChild(input);
            row.appendChild(td);
        });

        return; // don't advance inning just yet; wait for next score entry
        }
        else {
            showFinalScoreDialog();
        }
    }

  // Clear field if visible
    const fieldInterface = document.getElementById('fieldInterface');
    if (window.getComputedStyle(fieldInterface).display === 'block') {
    outs = 0;
    bases = [false, false, false];
    updateOuts();
    updateBasesAnimated();
    updatePlayerStatsTable();
    updateBatterDisplay();
    }

    // ---- HALF/INNING ADVANCE ----
    if (half === 'top') {
        half = 'bottom';
    } else {
        half = 'top';
        inning++;
    }

    updateFieldInterfaceVisibility();

    startHalfInningScore = half === 'bottom' ? homeTeamRuns : awayTeamRuns;

    // Update display
    document.getElementById('inningDisplay').innerText =
        `Inning: ${inning} (${half === 'top' ? 'Top' : 'Bottom'})`;
}

function showDoubleHeaderModal() {
    const homeList = document.getElementById('homeReorderList');
    const awayList = document.getElementById('awayReorderList');

    homeList.innerHTML = '';
    awayList.innerHTML = '';

    homePlayers.forEach(p => {
        const li = document.createElement('li');
        li.innerText = p.name;
        homeList.appendChild(li);
    });

    awayPlayers.forEach(p => {
        const li = document.createElement('li');
        li.innerText = p.name;
        awayList.appendChild(li);
    });

    // Make sortable
    Sortable.create(homeList, { animation: 150 });
    Sortable.create(awayList, { animation: 150 });

    $("#doubleHeaderModal").dialog({
        modal: true,
        width: 600,
        buttons: {
        "Start Game 2": function () {
            // Reorder arrays based on sorted list
            homePlayers = getSortedPlayersFromList(homeList, homePlayers);
            awayPlayers = getSortedPlayersFromList(awayList, awayPlayers);

            $(this).dialog("close");
            startGame2(); // Custom new game reset function
        }
        }
    });
}

function getSortedPlayersFromList(listEl, originalPlayers) {
    const names = [...listEl.querySelectorAll('li')].map(li => li.innerText);
    return names.map(name => originalPlayers.find(p => p.name === name));
}

function animateRunner(fromBase, toBase) {
  const runner = document.getElementById('runnerDot');
  if (!runner || !(fromBase in baseCoords) || !(toBase in baseCoords)) return;

  const from = baseCoords[fromBase];
  const to = baseCoords[toBase];

  // Set starting position
  runner.style.left = `${from.left}px`;
  runner.style.top = `${from.top}px`;
  runner.style.display = 'block';

  // Animate to target
  setTimeout(() => {
    runner.style.left = `${to.left}px`;
    runner.style.top = `${to.top}px`;
  }, 10);

  // Optional: hide after animation
  setTimeout(() => {
    runner.style.display = 'none';
  }, 900);
}

function updateFieldInterfaceVisibility() {
  const isHomeBatting = half === 'bottom';
  const hasHomeLineup = homePlayers.length > 0;
  const hasAwayLineup = awayPlayers.length > 0;

  const showField = (isHomeBatting && hasHomeLineup) || (!isHomeBatting && hasAwayLineup);
  document.getElementById('fieldInterface').style.display = showField ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    selectedTeam = document.querySelector('input[name="teamSelect"]:checked').value;

    document.querySelectorAll('input[name="teamSelect"]').forEach(radio => {
        radio.addEventListener('change', () => {
        selectedTeam = document.querySelector('input[name="teamSelect"]:checked').value;
        renderPlayerList();
        });
    });

    $(function () {
        $("#lineupModal").dialog({
            autoOpen: false,
            modal: true,
            width: 600,
            buttons: {
            Close: function () {
                $(this).dialog("close");
            }
            }
        });
    });
});

document.getElementById('homeTeam').addEventListener('input', () => {
  homeTeam = document.getElementById('homeTeam').value || 'Home';
  document.getElementById('homeTeamLabel').innerText = homeTeam;
  document.getElementById('homeTeamNamePreview').innerText = homeTeam;
  document.getElementById('lineupHomeTeamName').innerText = homeTeam;
  document.getElementById('homeLineupBtn').innerText = `${homeTeam} Lineup`;
});

document.getElementById('awayTeam').addEventListener('input', () => {
  awayTeam = document.getElementById('awayTeam').value || 'Away';
  document.getElementById('awayTeamLabel').innerText = awayTeam;
  document.getElementById('awayTeamNamePreview').innerText = awayTeam;
  document.getElementById('lineupAwayTeamName').innerText = awayTeam;
  document.getElementById('awayLineupBtn').innerText = `${awayTeam} Lineup`;
});

document.getElementById('toggleAdvancedStats').addEventListener('change', (e) => {
  localStorage.setItem('showAdvancedStats', e.target.checked);
  updatePlayerStatsTable();
});

document.getElementById('exportStatsBtn').addEventListener('click', () => {
  const headers = [
    'Team', 'Player', 'ABs', '1B', '2B', '3B', 'HR', 'Hits', 'FC', 'Ks', 'BBs', 'RBIs', 'TB', 'AVG', 'SLG', 'OBP'
  ];
  const csvRows = [headers.join(',')];

  const processTeam = (players, teamName) => {
    players.forEach(player => {
      const history = player.history || [];

      const count = val => history.filter(r => r === val).length;
      const hits = ['1B', '2B', '3B', 'HR'].reduce((sum, val) => sum + count(val), 0);
      const atBats = history.filter(r => !['BB'].includes(r)).length;
      const walks = count('BB');
      const strikeouts = count('K');
      const fcs = count('FC');
      const rbis = (player.rbis || 0); // make sure you're assigning this in your hit handling
      const totalBases = count('1B') + count('2B') * 2 + count('3B') * 3 + count('HR') * 4;

      const avg = atBats > 0 ? (hits / atBats).toFixed(3) : '0.000';
      const slg = atBats > 0 ? (totalBases / atBats).toFixed(3) : '0.000';
      const obp = (atBats + walks) > 0 ? ((hits + walks) / (atBats + walks)).toFixed(3) : '0.000';

      csvRows.push([
        teamName,
        player.name,
        atBats,
        count('1B'),
        count('2B'),
        count('3B'),
        count('HR'),
        hits,
        fcs,
        strikeouts,
        walks,
        rbis,
        totalBases,
        avg,
        slg,
        obp
      ].join(','));
    });
  };

  processTeam(awayPlayers, 'Away');
  processTeam(homePlayers, 'Home');

  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Softball_Stats_Game${Date.now()}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

if (savedToggle !== null) {
  document.getElementById('toggleAdvancedStats').checked = savedToggle === 'true';
}
