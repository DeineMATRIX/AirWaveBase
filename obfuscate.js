const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

console.log("🚀 Starte Obfuscation von main.js...");

const code = fs.readFileSync('main.js', 'utf8');

const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.85,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayThreshold: 0.85,
    stringArrayShuffle: true,
    stringArrayRotate: true,
    transformObjectKeys: true,
    renameGlobals: false,
    reservedNames: ["TEAM_DATA", "buildTeamList", "loadStream", "openAboutPage", "init"]
});

fs.writeFileSync('main-obfuscated.js', obfuscationResult.getObfuscatedCode());
console.log("✅ Obfuscation erfolgreich! → main-obfuscated.js wurde erstellt");