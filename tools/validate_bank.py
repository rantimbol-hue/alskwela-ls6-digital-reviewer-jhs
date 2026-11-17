#!/usr/bin/env python3
"""Validate ALSKwela expansion manifest and all new sets. Run from repo root."""
from pathlib import Path
from collections import Counter
import json,sys,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
B=ROOT/'bank'
def read(path):return json.loads(path.read_text(encoding='utf-8'))
manifest=read(B/'manifest.json');foundation=read(B/'foundation.json')
base=foundation['items'];size=manifest['trial_size'];
assert hashlib.sha256(json.dumps(base,ensure_ascii=False,sort_keys=True).encode()).hexdigest()==manifest['foundation_sha256'], 'Foundation checksum mismatch'
html=(ROOT/'index.html').read_text(encoding='utf-8')
embedded=json.loads(re.search(r'<script id=\"bank-data\" type=\"application/json\">(.*?)</script>',html,re.S).group(1))['items']
assert embedded==base, 'Foundation bank was changed compared to embedded original'
target={"Easy":9,"Moderate":15,"Challenging":6} if size==30 else {"Easy":12,"Moderate":20,"Challenging":8}
ids={q['item_id'] for q in base};assert len(ids)==len(base)==manifest['foundation_count']
assert len([q for q in base if q['set'] in 'ABC'])==len(base)
sets={'A':0,'B':0,'C':0}
for q in base:sets[q['set']]+=1
assert all(x==size for x in sets.values()),sets
assert manifest['schema_version']==1
seen=set()
for info in manifest['sets']:
 label=info['id'];assert label not in seen and label not in 'ABC';seen.add(label)
 relative=Path(info['file']);assert relative.parts[:2]==('bank','sets') and relative.suffix=='.json'
 rows=read(ROOT/relative)
 assert rows['set']==label and len(rows['items'])==size, label
 counts=Counter()
 for q in rows['items']:
  assert q['set']==label and q['item_id'] not in ids,q.get('item_id');ids.add(q['item_id'])
  assert q['answer'] in 'ABCD' and q[q['answer']]==q['correct_text'],q['item_id']
  assert len(set(q[c].strip().lower() for c in 'ABCD'))==4,q['item_id']
  assert all(q.get(x) for x in ['question','competency_id','focus','explanation','feedback_correct','feedback_incorrect']),q['item_id']
  counts[q['difficulty']]+=1
 assert counts==target,(label,counts,target)
 print('PASS Set',label,':',len(rows['items']),'items',dict(counts))
print('PASS:',len(base),'immutable foundation items +',len(ids)-len(base),'extension items; total',len(ids))
