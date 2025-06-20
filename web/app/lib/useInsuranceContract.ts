import { useWriteContract, useReadContract, useTransaction } from 'wagmi';
import { abi, contractAddress } from './insuranceContract';

export const useInsuranceContract = () => {
  // Create policy function
  const createPolicy = useWriteContract();

  // Wait for transaction
  const waitForCreatePolicy = useTransaction({
    hash: createPolicy.data,
  });

  // Get policy counter
  const policyCounter = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'policyCounter',
  });

  // Get policy by ID
  const getPolicy = (policyId: number) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getPolicy',
      args: [BigInt(policyId)],
    });
  };

  // Get farmer policies
  const getFarmerPolicies = (farmerAddress: string) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'getFarmerPolicies',
      args: [farmerAddress as `0x${string}`],
    });
  };

  return {
    createPolicy,
    waitForCreatePolicy,
    policyCounter,
    getPolicy,
    getFarmerPolicies,
  };
}; 