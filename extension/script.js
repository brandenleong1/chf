document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById('copy').addEventListener('click', copyClipboard);
	
	document.getElementById('in').addEventListener('input', updateOut);
	document.getElementById('box').addEventListener('input', seePassword);
	
	document.getElementById('in').onkeypress = function(e) {
		if (!e) e = window.event;
		var keyCode = e.keyCode;
		if (keyCode == 13) { //Enter
			copyClipboard();
		}
	};

	document.querySelector('body').onkeypress = function(e) {
		if (!e) e = window.event;
		var keyCode = e.keyCode;
		let i = document.getElementById('in');
		
		if (keyCode >= 48 && keyCode <= 57 || keyCode >= 97 && keyCode <= 122) { //Letter or number
			if (i != document.activeElement) {
				i.setSelectionRange(i.value.length, i.value.length);
				i.focus();
			}
		}
	}
	
}, false);

function updateOut() {
	if (document.getElementById('in').value != '') {
		document.getElementById('out_a').innerHTML = chf(document.getElementById('in').value).match(/.{1,4}/g).join(' ');
	} else {
		document.getElementById('out_a').innerHTML = '';
	}
}

function copyClipboard() {
	const x = document.createElement('textarea');
	x.value = document.getElementById('out_a').innerHTML.replace(/\s/g, '');
	document.body.append(x);
	x.select();
	document.execCommand('copy');
	document.body.removeChild(x);
	document.getElementById('in').value = '';
	updateOut();
}

function seePassword() {
	const f = document.getElementById('in');
	if (f.type === 'password') {
		f.type = 'text';
	} else {
		f.type = 'password';
	}
}

function rotateRight(x, n) {
	return x.substring(x.length - n) + x.substring(0, x.length - n);
}

function primeFactors(n) {
	var temp = []
	if (n != 0n) {
		while (n % 2n == 0n) {
			temp.push(2);
			n = n / 2n;
		}
	}
	for (var i = 3; i < 128; i += 2) {
		if (n != 0) {
			while (n % BigInt(i) == 0n) {
				temp.push(i);
				n = n / BigInt(i);
			}
		}
    }
	if (n > 2n && n < 128n) {
		temp.push(Number(n));
	}
	return temp;
}


function chf(n) {
	var m = ['0110101000001001', '1011101101100111', '0011011011001110', '1010010101001111',
		'0101000100001110', '1001101100000101', '0001111110000011', '0101101111100000']
	var k = ['0100001010001010', '0111000100110111', '1011010111000000', '1110100110110101',
		'0011100101010110', '0011100101010110', '1001001000111111', '1010101100011100',
		'1101100000000111', '0001001010000011', '0010010000110001', '0101010100001100',
		'0111001010111110', '1000000011011110', '1001101111011100', '1100000110011011']

	var temp = '';
	for (var i = 0; i < n.length; i++) {
		temp += n.charCodeAt(i).toString(16);
	}
	var f = BigInt('0x' + temp) * 2n + 1n;

    if (f.toString(2).length % 64 != 0) {
		temp = 64 - f.toString(2).length % 64;
        for (var i = 0; i < temp; i++) {
			f *= 2n;
        }
    }
   
   	var f_bin = f.toString(2);
	var f_list = [];

    for (var i = 0; i < f_bin.length / 64; i++) {
		f_list.push(BigInt('0b' + f_bin.substring(64 * i, 64 * i + 64)))
    }

    for (var i = 0; i < f_list.length; i++) {
		var w = [];
		for (var j = 0; j < 4; j++) { 
			w.push(f_list[i].toString(2).substring(j * 16, 16 + (j * 16)));
		}

		for (var j = 4; j < 16; j++) {
			var s0 = BigInt('0b' + rotateRight(w[j - 4], 5)) ^ BigInt('0b' + rotateRight(w[j - 4], 12)) ^ (BigInt('0b' + w[j - 4]) >> 2n);
			var s1 = BigInt('0b' + rotateRight(w[j - 2], 10)) ^ BigInt('0b' + rotateRight(w[j - 2], 13)) ^ (BigInt('0b' + w[j - 2]) >> 7n);

			if ((BigInt('0b' + w[j - 3]) + BigInt('0b' + w[j - 1]) + s0 + s1).toString(2).length >= 16) {
				w.push((BigInt('0b' + w[j - 3]) + BigInt('0b' + w[j - 1]) + s0 + s1).toString(2).substring((BigInt('0b' + w[j - 3]) + BigInt('0b' + w[j - 1]) + s0 + s1).toString(2).length - 16));
			} else {
				temp = (BigInt('0b' + w[j - 3]) + BigInt('0b' + w[j - 1]) + s0 + s1).toString(2)
				while (temp.length < 16) {
					temp = '0' + temp;
				}
				w.push(temp);
			}
		}

		var h = m;
		for (var j = 0; j < 16; j++) {
			var s0 = BigInt('0b' + rotateRight(h[4], 2)) ^ BigInt('0b' + rotateRight(h[4], 7)) ^ BigInt('0b' + rotateRight(h[4], 11));
			var s1 = (BigInt('0b' + h[4]) & BigInt('0b' + h[5])) ^ (~BigInt('0b' + h[4]) & BigInt('0b' + h[6]));
			var s2 = BigInt('0b' + rotateRight(h[0], 4)) ^ BigInt('0b' + rotateRight(h[0], 6)) ^ BigInt('0b' + rotateRight(h[0], 13));
			var s3 = (BigInt('0b' + h[0]) & BigInt('0b' + h[1])) ^ (BigInt('0b' + h[0]) & BigInt('0b' + h[2])) ^ (BigInt('0b' + h[1]) & BigInt('0b' + h[2]));
			var t1 = (BigInt('0b' + h[7]) + s0 + s1 + BigInt('0b' + k[j]) + BigInt('0b' + w[j])) % (2n ** 16n);
			var t2 = (s2 + s3) % (2n ** 16n);

			h[7] = h[6], h[6] = h[5], h[5] = h[4];
			if ((BigInt('0b' + h[3]) + t1).toString(2).length >= 16) {
				h[4] = (BigInt('0b' + h[3]) + t1).toString(2).substring((BigInt('0b' + h[3]) + t1).toString(2).length - 16);
			} else {
				temp = (BigInt('0b' + h[3]) + t1).toString(2);
				while (temp.length < 16) {
					temp = '0' + temp;
				}
				h[4] = temp;
			}

			h[3] = h[2], h[2] = h[1], h[1] = h[0];
			if ((t1 + t2).toString(2).length >= 16) {
				h[0] = (t1 + t2).toString(2).substring((t1 + t2).toString(2).length - 16);
			} else {
				temp = (t1 + t2).toString(2);
				while (temp.length < 16) {
					temp = '0' + temp;
				}
				h[0] = temp;
			}

			for (var y = 0; y < 8; y++) {
				m[y] = h[y];
			}
		}
    }

	var hash1 = '';
	for (var i = 0; i < 8; i++) {
		hash1 += m[i];
	}

	for (var i = 0; i < 16; i++) {
		primes = primeFactors(BigInt('0b' + hash1)).reverse();
		for (j of primes) {
			hash1 = hash1.charAt(j - 1) + hash1.substring(0, j - 1) + hash1.substring(j);
		}
		hash1 = hash1.split('').reverse().join('');
	}

	var hash2 = BigInt('0b' + hash1).toString(16);
	while (hash2.length < 32) {
		hash2 = '0' + hash2;
	}

	return hash2;
}