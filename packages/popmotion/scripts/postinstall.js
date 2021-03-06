#!/usr/bin/env node
/* eslint-disable */
/* Stolen from Styled Component's https://github.com/styled-components/styled-components/blob/master/scripts/postinstall.js */

const chalk = require('chalk');
const spacing = '      ';
const maxChars = 50;
const log = (...str) => console.log(spacing + str.join(''));

const pink = chalk.hex('#FF1C68');
const white = chalk.hex('#fff');
const lightGrey = chalk.hex('#ECECEC');
const blue = chalk.hex('#049CD4');

const horizontalLine = pink('+' + new Array(maxChars).join('-') + '+');
const paddingRow = pink('|' + new Array(maxChars).join(' ') + '|');

const content = (str, textColor = white) => {
  const padding = (maxChars - str.length) / 2;
  const leftPadding = new Array(Math.floor(padding)).join(' ');
  const rightPadding = new Array(Math.ceil(padding)).join(' ');
  return pink('| ') + leftPadding + textColor(str) + rightPadding + pink('|');
};

log('');
log(horizontalLine);
log(paddingRow);
log(content('Hey! Using Popmotion commercially?'));
log(paddingRow);
log(content('Popmotion is completely open source.', lightGrey));
log(content(`Its continued development relies on`, lightGrey));
log(content(`contributions and sponsorship.`, lightGrey));
log(paddingRow);
log(content('Join us: patreon.com/popmotion', blue));
log(paddingRow);
log(horizontalLine);
log('');
