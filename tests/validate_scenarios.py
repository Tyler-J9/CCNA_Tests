"""Independently recompute numeric/address/ACL answers from the emitted prompts."""
import json, pathlib, re, ipaddress
bank=json.loads((pathlib.Path(__file__).parents[1]/'questions.json').read_text())['questions']
checks=0
for q in bank:
    no=int(q['id'][1:]); answer=[q['options'][i] for i in q['correct']]
    if 321<=no<=340:
        stem=q['stem']
        if 'smallest block' in stem:
            required=int(re.search(r'requires (\d+)',stem)[1])
            expected='/'+str(max(p for p in range(1,31) if 2**(32-p)-2>=required))
        else:
            net=ipaddress.ip_network(re.search(r'(\d+\.\d+\.\d+\.\d+/\d+)',stem)[1],strict=False)
            expected=str(net.network_address) if 'network address' in stem else str(net.broadcast_address) if 'broadcast address' in stem else str(net.num_addresses-2)
        assert answer==[expected],(q['id'],answer,expected);checks+=1
    elif 341<=no<=360:
        dst=ipaddress.ip_address(re.search(r'to (\d+\.\d+\.\d+\.\d+)',q['stem'])[1]);entries=[]
        for prefix,hop in re.findall(r'(\d+\.\d+\.\d+\.\d+/\d+).*?via (\d+\.\d+\.\d+\.\d+)',q['cli']):
            net=ipaddress.ip_network(prefix)
            if dst in net:entries.append((net.prefixlen,hop))
        assert answer==[max(entries)[1]],q['id'];checks+=1
    elif 361<=no<=375:
        src,dst,proto,port=re.search(r'from (\S+) to ([\d.]+), (TCP|UDP) destination port (\d+)',q['stem']).groups();port=int(port)
        rules=q['cli'].splitlines()[1:];expected='Denied by the implicit deny'
        for line in rules:
            tokens=line.split();seq,action,protocol=tokens[:3]
            if protocol.lower()!=proto.lower():continue
            if tokens[3]=='host':sm=src==tokens[4];dest=tokens[6];p=int(tokens[8])
            else:sm=ipaddress.ip_address(src) in ipaddress.ip_network(tokens[3]+'/24');dest=tokens[6] if tokens[5]=='host' else 'any';p=int(tokens[-1])
            if sm and (dest=='any' or dst==dest) and port==p:
                expected=('Permitted' if action=='permit' else 'Denied')+' by entry '+seq;break
        assert answer==[expected],(q['id'],answer,expected);checks+=1
print(f'{checks} independent subnet, routing and ACL answer calculations passed.')
