import sys
sys.path.append('backend')
from cmc_api import CMCClient

print(CMCClient.get_info("ftx-token"))
