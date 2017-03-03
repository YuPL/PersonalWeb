// JavaScript Document
index = 0;
num = new Array(); // 用于存放按钮点击过的按钮编号,用于处理
indexs = new Array(); // 用于存放按钮点击过的按钮编号，按照点击的顺序存放
res = new Array();
resText = new Array();
begTime = null;
isSubmit = false;
isRight = 0;
lineNum = 1;
maxLineNum = 3;
actionBeforeIsDel = 0;
sentLength = sent.split('').length;

function isCross(id) {// 判断当前点击的字是否与已有的分词交叉
	for (var i = 0; i < index; i += 2) {
		if (index % 2 == 0) {
			if (id >= num[i] && id <= num[i + 1]) {
				alert("有交叉");
				return 0;
			}
		} else {
			if (i < index - 2) {
				if (id >= num[i] && id <= num[i + 1]) {
					alert("有交叉");
					return 0;
				}
			} else {
				if (id == num[i] && i != index - 1) {
					alert("有交叉");
					return 0;
				}
			}
		}
	}
	return 1;
}

function isIncluded(id) {// 判断当前分词是否包含已有分词
	if (id < num[index - 1]) {
		min = id;
		max = num[index - 1];
	} else {
		min = num[index - 1];
		max = id;
	}
	for (var i = 0; i < index - 1; i += 2) {
		if (min <= num[i] && max >= num[i + 1]) {
			alert("包含已有分词");
			return 0;
		}
	}
	return 1;
}

function isTaskRelated(id) {// 判断当前分词是否与任务相关
	var task = document.getElementById('task').value;
	tasks = task.split("_");
	if (id < num[index - 1]) {
		min = id;
		max = num[index - 1];
	} else {
		min = num[index - 1];
		max = id;
	}
	if((max % 200 < tasks[0] || min % 200 > tasks[1])&&(max % 200 < tasks[2] || min % 200 > tasks[3])){
		alert("当前分词与任务无关");
		return 0;
	}
	return 1;
}

function changecolor(id) {
	isSingle = 0;
	if (index % 2 == 0) {
		ind = id + "\n";
		for (var i = 0; i <= index - 1; i = i + 2) {
			ind = ind + num[i] + "\t" + num[i + 1] + "\n";
		}
		for (var i = 0; i <= index - 1; i = i + 2) {
			if (isSingle == 0) {
				color = '#FFAAD5';
				isSingle = 1;
			} else {
				color = '#CECEFF';
				isSingle = 0;
			}
			for (var j = num[i]; j <= num[i + 1]; j++) {
				var td = document.getElementById(j);
				td.style.background = color;
			}
		}
	} else {
		var td = document.getElementById(id);
		td.style.background = '#E0E0E0';
	}
}

function addIndex(id) {
	index++;
	if (index > 1 && index % 2 == 0 && id < num[index - 2]) {
		num[index - 1] = num[index - 2];
		num[index - 2] = id;
	} else {
		num[index - 1] = id;
	}
}

function sortNum() {
	for (var i = 0; i <= index - 3; i += 2) {
		for (var j = i + 2; j <= index - 1; j += 2) {
			if (num[i] > num[j]) {
				tempF = num[i];
				tempS = num[i + 1];
				num[i] = num[j];
				num[i + 1] = num[j + 1];
				num[j] = tempF;
				num[j + 1] = tempS;
			}
		}
	}
}

function getTrHtml() {// 将句子按格式封装好，返回html
	sent = document.getElementById('sent').value;
	task = document.getElementById('task').value;
	words = sent.split('');
	tasks = task.split('_');
	trhtml = "<tr>";
//	if (lineNum != 1)
//		trhtml += "<td><input type='button' onclick='return del(this" + ","
//				+ lineNum + " );'value='删除' /></td>";
//	else
//		trhtml += "<td></td>"
	for (var i = 0; i < words.length; i++) {
		id = i + lineNum * 200;
		if (i >= tasks[0] && i <= tasks[1])
			color = " bgcolor = #A6FFFF";
		else
			color = ' bgcolor = #FFFFCC';
		trhtml += "<td align='center'  id= "+ id+ color+ " onclick=' return click_event("+ id+ " );' >" + words[i] + "</td>";
	}
	trhtml += " </tr> ";
	return trhtml;
}

function add() {// 添加行
	if (actionBeforeIsDel == 0 && checkBeforeAdd() == 0) {
		return;
	}
	if (lineNum >= maxLineNum) { // 限制行数
		alert("每个任务至多提交三个分词结果，已达到上限！");
		actionBeforeIsDel = 1;
		return;
	}
	actionBeforeIsDel = 0;
	index = 0;
	num = new Array();
	lineNum++;
	var oTab = document.getElementById('label');
	var oTr = document.createElement('tr');// 创建一个tr
	oTr.innerHTML = getTrHtml();
	oTr.setAttribute('id', ('tr' + lineNum));// 为tr设置id
	oTab.tBodies[0].appendChild(oTr);// 将整个tr插入到表格中
}

function reset() {
	if (lineNum == res.length)
		res.splice((lineNum - 1), 1);
	var labelLine = document.getElementById('tr' + lineNum);
	labelLine.innerHTML = getTrHtml();
	labelLine.setAttribute('id', ('tr' + lineNum));
	index = 0;
	num = new Array(); // 用于存放按钮点击过的按钮编号,用于处理
	isSubmit = false;
	isRight = 0;
	actionBeforeIsDel = 0;
}

function click_event(id) {
	if (actionBeforeIsDel == 1)
		return;
	if (id < (lineNum) * 200) {
		alert("请点击当前句子");
		return;
	}
	if (isCross(id) == 0)// 判断当前点击的id是否在已有的分词中有交叉
		return 0;
	if (index % 2 == 1) {// 如果当前是偶数次点击，则需要判断当前分词是否包含已有分词
		if (isIncluded(id) == 0)
			return 0;
		if (isTaskRelated(id) == 0)
			return 0;
	}
	addIndex(id);
	actionBeforeIsDel = 0;
	if (index % 2 == 0)
		sortNum();
	changecolor(id);
	return 1;
}

function checkBeforeAdd() {
	var task = document.getElementById('task').value;
	tasks = task.split("_");
	var str = "";
	if (index == 0) {// 该行未选择，默认答案
		str = document.getElementById('task').value;
	} else {
		if (index % 2 != 0) {
			alert("点击次数为奇数次，不能提交！");
			return 0;
		}
		if(num[0] % 200 > tasks[0] % 200) {// 任务中，有部分未点击，默认为答案中的一个词
			var start = tasks[0] % 200;
			var end = num[0] % 200 - 1;
			str += start + '_' + end + '&';
		}
		for (var i = 0; i < index; i += 2) {
			if (i != 0) {
				str += "&";
				str1 += "&";
			}
			str += num[i] % 200 + "_" + num[i + 1] % 200;
			if (i < index - 2) {
				if (num[i + 1] != (num[i + 2] - 1))
					str += "&" + (num[i + 1] % 200 + 1) + "_"
							+ (num[i + 2] % 200 - 1);
			}

		}
		if(num[num.length - 1] % 200 < tasks[1] % 200) {
			var start = num[num.length - 1] % 200 + 1;
			var end = tasks[1] % 200;
			str += '&' + start + '_' + end;

		}
	}
	isExist = -1;
	for (var i = 0; i < res.length; i++) {
//		if (res[i] == str) {
//			alert("当前答案和已有答案相同，请修改！");
//			return 0;
//		}
	}
	if (isExist < 0) {
		res[lineNum - 1] = str;
	}
	return 1;
}

function judgeRight() {
	var item = document.getElementById('gold').value;
	if (item != "") {// 有答案的情况下
		for (var j = 0; j < res.length; j++) {
			if (res[j] == item) {
				isRight = 1;
				return j;
			}
		}
		isRight = -1;
	} else {
		isRight = 0;
	}
	return -1;
}

function submit() {
	if (actionBeforeIsDel == 0 && checkBeforeAdd() == 0) {
		return;
	}
	saveTaskAndUserAns();// 保存用户标注情况以及标注答案
	// if (source == 1) {
	// var rightNum = judgeRight();
	// showRes(rightNum);
	// }
	// isSubmit = true;
	// if ($.cookie('level') == 1)
	// document.location.href = tplroot + '/Home/Label/ShowTask';
}

function saveTaskAndUserAns() {
	var now = new Date();
	endTime = format(now);
	var result = res.join("|");
	var form = document.createElement("form");
	form.action = tplroot + '/Home/Label/SaveTaskAndUserRes';
	form.method = "post";
	form.style.display = "none";
	var Name = new Array("result", "taskid", "begtime", "endtime", "username",
			"source", "isRight");
	var Value = new Array(result, taskid, begTime, endTime, $
			.cookie('username'), source, isRight);
	for (var i = 0; i < Name.length; i++) {
		var opt = document.createElement("textarea");
		opt.name = Name[i];
		opt.value = Value[i];
		form.appendChild(opt);
	}
	document.body.appendChild(form);
	form.submit();
}

// function showRes(rightNum) {
// var item = document.getElementById('gold').value;
// var table = document.getElementById('table');
// if (item != "") {
// var sent = document.getElementById('sent').value;
// chars = sent.split('');
// resText = " ";
// itemText = " ";
// resArray = res.split("|");
// for (var k = 0; k < resArray.length; k++) {
// ress = resArray[k].split("&");
// if (k != 0) {
// resText += ',';
// }
// for (var j = 0; j < ress.length; j++) {
// if (j != 0)
// resText += " ";
// resIndex = ress[j].split("_");
// for (var m = parseInt(resIndex[0]); m <= parseInt(resIndex[1]); m++) {
// resText += chars[m];
// }
// }
// }
// items = item.split("&");
// for (var j = 0; j < items.length; j++) {
// if (j != 0)
// itemText += " ";
// itemIndex = items[j].split("_");
// for (var m = parseInt(itemIndex[0]); m <= parseInt(itemIndex[1]); m++) {
// itemText += chars[m];
// }
//
// }
// if (isRight == -1) {
// table.rows[0].cells[0].innerHTML = "<font size=4
// color='red'>分词结果不正确，你的分词是</font><font size=5 color='blue'>"
// + resText
// + " </font><br><font size=4
// color='red'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp正确答案为</font><font size=5
// color='blue'>"
// + itemText + "</font>";
// } else {
// rightNum++;// 便于用户理解，将序列号+1
// table.rows[0].cells[0].innerHTML = "<font size=4 color='red'>第 "
// + rightNum
// + " 个分词结果正确,答案为</font><font size=5 color='blue'>"
// + itemText + "</font>";
// }
// }
// document.getElementById("submit").disabled = true;
// document.getElementById("add").disabled = true;
// }

// function saveTaskAndUserAns() {
// var now = new Date();
// endTime = format(now);
// var result = res.join("|");
// $.ajax({
// url : tplroot + '/Home/Label/SaveTaskAndUserRes',
// type : 'post',
// async : false,// 改为同步方式
// data : {
// "result" : result,
// "taskid" : taskid,
// "begtime" : begTime,
// "endtime" : endTime,
// "username" : $.cookie('username'),
// "source" : source,
// "isRight" : isRight,
// },
// success : function() {
// },
// error : function() {
// alert("保存任务失败");
// }
// });
// return false;
// }

// function indexOfId(id) {// 判断当前id在num数组中的位子
// for (var i = 0; i <= index + 1; i++) {
// if (num[i] == id)
// return i;
// }
// return -1;
// }

// function next() {
// if (isSubmit)
// document.location.href = tplroot + '/Home/Label/ShowTask';
// else
// alert("未提交答案，请先提交答案");
// }