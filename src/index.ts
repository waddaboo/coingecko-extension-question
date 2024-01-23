const { Web3 } = require('web3');

const main = async () => {
  // Contract Calls Knowledge
  const MANA_ADDRESS = '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4';

  const erc20Abi = [
    {
      name: 'totalSupply',
      outputs: [{ type: 'uint256' }],
      type: 'function',
    },
  ];

  const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-rpc.com'));

  const manaContract = new web3.eth.Contract(erc20Abi, MANA_ADDRESS);
  const totalSupply = await manaContract.methods.totalSupply().call();
  console.log('MANA Token Total Supply: ', web3.utils.fromWei(totalSupply, 'ether'));

  // DEX Event Logs

  // convert block number to hash
  const block = web3.utils.toHex(26444465);
  const blockHash = '0x8f5210b3052133904b5596a1345dc361e832eed56b181226c459eecb51113336';
  const topics = ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'];

  // get block by hash
  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getLogs',
    params: [
      {
        blockHash,
        topics,
      },
    ],
  };

  // get block by block number
  const alternateData = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getLogs',
    params: [
      {
        fromBlock: block,
        toBlock: block,
        topics,
      },
    ],
  };

  const rpcApi = await fetch('https://polygon-rpc.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await rpcApi.json();
  console.log(json.result);
  console.log('Total swap events: ', json.result.length);
  console.log(
    'Transaction Hash: ',
    json.result.map((tx) => tx.transactionHash)
  );

  process.exit(0);
};

main();
