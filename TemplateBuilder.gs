function getTemplateFormulas(username) {
  return [[
    '=FILTER(\'40 Day Form Response\'!A2:I, \'40 Day Form Response\'!J2:J = "' + username + '")',
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    '=ARRAYFORMULA(LEN(REGEXREPLACE(E2:E, "(?s)[\\S]+", "")))',
    '=ARRAYFORMULA(LEN(REGEXREPLACE(E2:E,"[^?!.]|(\\.\\.\\.)", "")))',
    '=ARRAYFORMULA(IFERROR(ROUND(J2:J / K2:K), 0))',
    '=ARRAYFORMULA(IF(F2:F <> "", F2:F, 0))',
    '=ARRAYFORMULA(IFERROR(J2:J / M2:M, 0))',
    '=ARRAYFORMULA(IF(A2:A <> "", "' + username + '", ""))'
  ]];
}
