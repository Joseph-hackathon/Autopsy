import sys
sys.path.append('backend')
from cmc_api import CMCClient

tokens = ['ROUTE', 'SAFEMOON', 'FTT', 'LUNA', 'CEL', 'VGX', 'USTC', 'EOS', 'NEO', 'ALGO']
for t in tokens:
    try:
        ident = CMCClient.resolve_token_identity(t)
        if 'error' not in ident:
            print(f"{t}: https://s2.coinmarketcap.com/static/img/coins/64x64/{ident['id']}.png")
        else:
            print(f"{t}: error")
    except Exception as e:
        print(f"{t}: exception {e}")
