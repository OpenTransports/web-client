// Capitalize a given string
// Example: My name is Louis ==> My Name Is Louis
// @param str <string> the string to capitalize
// @return <string> the capitalized string
export function capitalize(str: string): string {
	str = str.toLowerCase()
	var newStr = ""
	var i = 0
	var len = str.length
	var wasSpace = true

	while (i < len) {
		if (wasSpace) {
			newStr = newStr + str[i].toUpperCase()
		} else {
			newStr = newStr + str[i]
		}
		wasSpace = str[i] == " "
		i++
	}

	return newStr
}
