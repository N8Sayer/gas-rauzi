function getTemplateFormulas(username) {
  return [[
    '=IFERROR(FILTER(\'40 Day Form Response\'!$A$2:$I, \'40 Day Form Response\'!$J$2:$J = "' + username + '", \'40 Day Form Response\'!$K$2:$K = "Sorted"), "")',
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    '=ARRAYFORMULA(IF(A2:A <> "", LEN(REGEXREPLACE(E2:E, "(?s)[\\S]+", "")), ""))',
    '=ARRAYFORMULA(IF(A2:A <> "", LEN(REGEXREPLACE(E2:E,"[^?!.]|(\\.\\.\\.)", "")), ""))',
    '=ARRAYFORMULA(IF(A2:A <> "", IFERROR(ROUND(J2:J / K2:K), 0), ""))',
    '=ARRAYFORMULA(IF(A2:A <> "", IF(F2:F <> "", F2:F, 0), ""))',
    '=ARRAYFORMULA(IF(A2:A <> "", IFERROR(J2:J / M2:M, 0), ""))',
    '=ARRAYFORMULA(IF(A2:A <> "", "' + username + '", ""))'
  ]];
}
