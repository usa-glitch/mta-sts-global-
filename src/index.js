// src/index.js – MTA-STS Policy Worker for all domains
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Only serve the exact required path
    if (url.pathname !== '/.well-known/mta-sts.txt') {
      return new Response('Not Found', { status: 404 });
    }

    // Extract domain from mta-sts.<domain>
    const match = hostname.match(/^mta-sts\.(.+)$/);
    if (!match) {
      return new Response('Invalid MTA-STS subdomain', { status: 400 });
    }
    const domain = match[1];

    // Policy definitions – based on your diagnostic recommendations
    const policies = {
      'eatrading.group': `version: STSv1
mode: testing
mx: alt1.aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt2.aspmx.l.google.com
mx: aspmx.l.google.com
max_age: 604800`,

      'office.eatrading.group': `version: STSv1
mode: testing
mx: smtp.google.com
max_age: 604800`,

      'eatgglobalcapital.com': `version: STSv1
mode: testing
mx: aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt4.aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: alt2.aspmx.l.google.com
max_age: 604800`,

      'eatgholdings.com': `version: STSv1
mode: testing
max_age: 604800`,

      'eatgbank.com': `version: STSv1
mode: testing
mx: aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: alt2.aspmx.l.google.com
max_age: 604800`,

      'eatgglobal.com': `version: STSv1
mode: testing
mx: aspmx.l.google.com
mx: alt3.aspmx.l.google.com
mx: alt4.aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: alt2.aspmx.l.google.com
max_age: 604800`,

      'eatgbanking.com': `version: STSv1
mode: testing
mx: aspmx.l.google.com
mx: alt1.aspmx.l.google.com
mx: alt2.aspmx.l.google.com
max_age: 604800`,

      // Subdomains that likely don't receive email – generic policy
      'investor.eatgglobalcapital.com': `version: STSv1
mode: testing
max_age: 604800`,

      'secure.eatgglobalcapital.com': `version: STSv1
mode: testing
max_age: 604800`,

      'custody.eatgglobalcapital.com': `version: STSv1
mode: testing
max_age: 604800`,

      'allocations.eatgglobalcapital.com': `version: STSv1
mode: testing
max_age: 604800`,

      'governance.eatgholdings.com': `version: STSv1
mode: testing
max_age: 604800`,

      'secure.eatgholdings.com': `version: STSv1
mode: testing
max_age: 604800`,

      'secure.eatgbanking.com': `version: STSv1
mode: testing
max_age: 604800`,

      'compliance.eatgbank.com': `version: STSv1
mode: testing
max_age: 604800`,

      'settlements.eatgbank.com': `version: STSv1
mode: testing
max_age: 604800`
    };

    const policy = policies[domain];
    if (!policy) {
      return new Response('No MTA-STS policy configured for this domain', { status: 404 });
    }

    return new Response(policy, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'max-age=3600'
      }
    });
  }
};