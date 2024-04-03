/**You are going to be given a word. Your job will be to make sure that each character in that word has the exact same number of occurrences. You will return true if it is valid, or false if it is not.

For this kata, capitals are considered the same as lowercase letters. Therefore: "A" == "a"

The input is a string (with no spaces) containing [a-z],[A-Z],[0-9] and common symbols. The length will be 0 < length < 100. */

// function validateWord(s) {
//   const charCount = {};
//   for (let char of s.toLowerCase()) {
//     charCount[char] = (charCount[char] || 0) + 1;
//   }

//   // Check if all counts are the same
//   const counts = Object.values(charCount);
//   const expectedCount = counts[0];
//   for (let count of counts) {
//     if (count !== expectedCount) {
//       return false;
//     }
//   }
//   return true;
// }

/**Create a function that returns the sum of the two lowest positive numbers given an array of minimum 4 positive integers. No floats or non-positive integers will be passed.

For example, when an array is passed like [19, 5, 42, 2, 77], the output should be 7.

[10, 343445353, 3453445, 3453545353453] should return 3453455. */

function sumTwoSmallestNumbers(numbers) {
    // Sort the array of numbers in ascending order
    let sortedNumbers = numbers.sort((a, b) => a - b);
    
    // Return the sum of the first two elements in the sorted array
    return sortedNumbers[0] + sortedNumbers[1];
}

// Example usage:
console.log(sumTwoSmallestNumbers([19, 5, 42, 2, 77]));  // Output: 7
console.log(sumTwoSmallestNumbers([10, 343445353, 3453445, 3453545353453]));  // Output: 3453455


//oxirgi uyga vazifa uchun masala