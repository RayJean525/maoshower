$(function () {
    let myModal = new bootstrap.Modal($("#modal"));

    let datas;
    $.ajax({
        url: "db.json",
        type: "get",
        dataType: "json",
        success: function (result) {
            datas = result;
        },
        error: function (msg) {
            console.log(msg);
            $(".modal-p").text("資料讀取錯誤，請call老二瑞君！！");
            myModal.show();
        },
    });

    //當天日期
    let today = new Date();
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, "0");
    let day = today.getDate().toString().padStart(2, "0");
    $(".start").val(`${year}-${month}-${day}`);

    $(document).on("change", ".start,.end", function () {
        let startDate = new Date($("#start").val());
        let endDate = new Date($("#end").val());

        // 計算日期毫秒數差
        let timeDiff = endDate.getTime() - startDate.getTime();
        // 秒數轉天數
        let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // 取月份
        let getDateMonth = startDate.getMonth() + 1;

        // 方案選擇
        let planschecked =
            datas[$("input[name='holiday']:checked").val()].size[
                $("input[name='size']:checked").val()
            ].weight[$("input[name='weight']:checked").val()].plans;

        if ($("#start").val() !== "" && $("#end").val() !== "") {
            if (timeDiff < 0) {
                $(".end").val("");
                $(".numberday,.numbermonth").text("");
                $(".modal-p").text("日期錯誤！！");
                myModal.show();
            } else {
                $(".numberday").text(daysDiff);
                $(".numbermonth").text(getDateMonth);
                if ($("#start").val() !== "" && $("#end").val() !== "") {
                    $(".fm_plan").each(function (i, v) {
                        let planval = $(this)
                            .find('input[type="checkbox"]')
                            .val();
                        $(this)
                            .find(".fm_staymoney")
                            .text(`${planschecked[planval] * daysDiff}`);
                        $(this)
                            .find(".fm_strolldaymoney")
                            .text(`${planschecked[planval] * daysDiff}`);
                        $(this)
                            .find(".fm_plansmoney")
                            .text(`${planschecked[planval]}`);
                    });
                }
            }
        }
    });
    $(document).on("change", ".holiday,.size,.weight", function () {
        let startDate = new Date($("#start").val());
        let endDate = new Date($("#end").val());

        // 計算日期毫秒數差
        let timeDiff = endDate.getTime() - startDate.getTime();
        // 秒數轉天數
        let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // 假日選擇
        let datachecked = datas[$("input[name='holiday']:checked").val()];
        // 體型選擇 & 體型價錢
        let sizechecked =
            datachecked.size[$("input[name='size']:checked").val()];
        let sizemoney =
            datachecked.size[$("input[name='size']:checked").val()].money;
        // 體重選擇 & 體重價錢
        let weightchecked =
            sizechecked.weight[$("input[name='weight']:checked").val()];
        let weightmoney =
            sizechecked.weight[$("input[name='weight']:checked").val()].money;
        // 方案選擇
        let planschecked = weightchecked.plans;

        $(".fm_sizemoney").text(`${sizemoney}`);
        $(".fm_weightmoney").text(`${weightmoney}`);
        if ($("#start").val() !== "" && $("#end").val() !== "") {
            $(".fm_plan").each(function (i, v) {
                let planval = $(this).find('input[type="checkbox"]').val();
                $(this)
                    .find(".fm_staymoney")
                    .text(`${planschecked[planval] * daysDiff}`);
                $(this)
                    .find(".fm_strolldaymoney")
                    .text(`${planschecked[planval] * daysDiff}`);
                $(this).find(".fm_plansmoney").text(`${planschecked[planval]}`);
            });
        }
        if($(".holidayN").is(":checked")){
            $(".form_evenholiday").css("display","flex")
        } else {
            $(".form_evenholiday").hide();
        }
    });
    // 視窗確定
    $(document).on("click", ".word_sure", function () {
        $(".word").hide();
        $(".word_box").empty();
    });
    // 複製
    $(document).on("click", ".word_copy", function () {
        // 複製內容
        let textToCopy = $(".word_boxwindow")
        .contents() // 取得所有節點
        .map(function() {
            if (this.nodeType === 3) {
                // 文字節點
                return this.nodeValue.trim(); // 去除前後空格
            } else if (this.nodeType === 1 && this.tagName === 'P') {
                // p元素
                return "\n\n" + this.innerText.trim(); // 在每個p元素前添加兩行斷行字符
            }
        })
        .get() // 轉換為純文字陣列
        .join(""); // 合併為一個字串

        // 加入 h1 元素的內容
        let h1Content = $(".word_boxwindow h1").text();
        let numberOfSpaces = 0; // 指定要添加的空格行數
        let emSpace = '\u2003'; // 使用 Unicode 的 EM SPACE 字符
        let spaceString = emSpace.repeat(numberOfSpaces); // 產生多個 EM SPACE 字符
        textToCopy = spaceString + h1Content + textToCopy;

        // 檢查瀏覽器是否支持 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 新版 Clipboard API 複製文本
            navigator.clipboard
                .writeText(textToCopy)
                .then(function () {
                    $(".modal-p").text("複製成功！！");
                    myModal.show();
                })
                .catch(function (error) {
                    $(".modal-p").text(
                        "複製失敗！！複製功能壞掉請call老二瑞君！！"
                    );
                    myModal.show();
                });
        } else {
            // 傳統
            let tempTextArea = $("<textarea>");
            tempTextArea.val(textToCopy);
            $("body").append(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            tempTextArea.remove();
            $(".modal-p").text("複製成功！！");
            myModal.show();
        }
    });

    //圖片
    $(document).on("click",".word_picture",function(){
        $(".word_boxwindow").css("overflow","initial")
        $(".word_boxwindow").css("min-width","555px")
        let elementToCapture = document.querySelector('.word_boxwindow');
        
        html2canvas(elementToCapture, {
            useCORS: true,
            scrollY: -window.scrollY,
            width: 555, // 寬度
            height: elementToCapture.scrollHeight, // 高度
            windowheight: elementToCapture.scrollHeight
        }).then(function(canvas) {
            let link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = '老二.png';

            link.click();

            $(".modal-p").text("下載成功！！");
            myModal.show();
        });

        $(".word_boxwindow").css("overflow","auto")
        $(".word_boxwindow").css("min-width","initial")
    });
    
    $(document).on("click", ".submit", function () {
        event.preventDefault();
        let name = $(".name").val();
        let startDate = new Date($("#start").val());
        let endDate = new Date($("#end").val());
        // 計算日期毫秒數差
        let timeDiff = endDate.getTime() - startDate.getTime();

        // 秒數轉天數
        let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // 日期MM/DD轉換
        let getStartMonth = (startDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        let getStartDay = startDate.getDate().toString().padStart(2, "0");
        let getEndMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
        let getEndDay = endDate.getDate().toString().padStart(2, "0");

        // 假日選擇
        let holidaychecked;
        let datachecked = datas[$("input[name='holiday']:checked").val()];
        // 連假天數
        let evenholiday = $(".evenholiday").val()
        // 寵物數量
        let quantity = $(".quantity").val()
        // 體型選擇 & 體型價錢 & 體型名稱
        let sizeval = $("input[name='size']:checked").siblings().text();
        let sizemoney =
            datachecked.size[$("input[name='size']:checked").val()].money;
        // 方案選擇
        let planschecked =
            datas[$("input[name='holiday']:checked").val()].size[
                $("input[name='size']:checked").val()
            ].weight[$("input[name='weight']:checked").val()].plans;

        let selectedOptions = [];
        let selectedplans = [[]]; //方案選項
        let englishlist=[]//方案總項目大老二
        let englishlistp = [];//方案項目
        let examplehtml = "";
        let planshtml = "";
        let totallibrary;
        let total;
        
        //勾選的方案項目
        $('.fm_plan input[type="checkbox"]:checked').each(function() {
            if($(this).val() !== "stay"){
                selectedOptions.push($(this).val());
                //新增範例方案項目
                switch ($(this).val()) {
                    case "strollday":
                        examplehtml += `公園散步一日兩次 = ${planschecked["strollday"] * daysDiff * quantity}元/${daysDiff}天<br>`
                        break
                    case "dayshower":
                        examplehtml += `住宿當日洗香香 = ${planschecked["dayshower"] * quantity}元/次<br>`
                        break
                    case "homeshower":
                        examplehtml += `回家前洗香香 = ${planschecked["homeshower"] * quantity}元/次<br>`
                        break
                    case "sleep":
                        examplehtml += `褓姆陪伴睡覺 = ${planschecked["sleep"] * daysDiff * quantity}元/${daysDiff}天<br>`
                        break
                    case "medicine":
                        examplehtml += `用藥 = ${planschecked["medicine"] * daysDiff * quantity}元/${daysDiff}天<br>`
                        break
                    default:
                        $(".modal-p").text(
                            "新增範例方案項目失敗！！新增範例方案項目功能壞掉請call老二瑞君！！"
                        );
                        myModal.show();
                        break
                }
            }
        });
        
        for (let i = 0; i < selectedOptions.length; i++) {
            // generateSubsets新增原始陣列
            let subsets = generateSubsets(selectedOptions, i + 1);
            selectedplans = selectedplans.concat(subsets);
        }

        if($(".holidayN").is(":checked")){
            holidaychecked = evenholiday + $("input[name='holiday']:checked").data("holiday") + `=${(sizemoney * quantity) + 200 }元/日`
            // 判斷是否都是連續假日
            if(daysDiff - evenholiday !== 0){
                totallibrary =  sizemoney * quantity * (daysDiff - evenholiday)
                selectedplans = selectedplans.map(function (subset) {
                    return ["stay","evenholiday"].concat(subset);
                });
            } else {
                totallibrary =  sizemoney * quantity * daysDiff
                selectedplans = selectedplans.map(function (subset) {
                    return ["evenholiday"].concat(subset);
                });
            }
        } else {
            holidaychecked = $("input[name='holiday']:checked").data("holiday");
            totallibrary =  sizemoney * quantity * daysDiff
            selectedplans = selectedplans.map(function (subset) {
                return ["stay"].concat(subset);
            });
        }
        
        //方案項目英文字
        for (let m = 65; m <= 90; m++) {
            englishlist.push(String.fromCharCode(m));
        }
        //方案項目英文字超過26
        if(selectedplans.length > 26){
            for (let a = 65; a <= 90; a++) {
                for (let b = 65; b <= 90; b++) {
                    englishlist.push(String.fromCharCode(a) + String.fromCharCode(b));
                }
            }
        }
        
        //方案新增
        for(let h = 0; h < selectedplans.length; h++){
            let totaltxt = ``;
            englishlistp.push(englishlist[h]);
            planshtml += `<br><p class="word_red fs-5 fw-bold lh-base">${englishlist[h]}方案</p>`
            total = totallibrary;
            for(let t = 0; t < selectedplans[h].length; t++){
                switch (selectedplans[h][t]) {
                    case "stay":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${sizemoney * quantity}元 x ${daysDiff - evenholiday}天 = ${total}元 (一般平日住宿費)</p>`
                        totaltxt += `${daysDiff}天住宿`
                        break
                    case "evenholiday":
                        if($(".holidayN").is(":checked")){
                            if(daysDiff - evenholiday !== 0){
                                planshtml += `
                                    <p class="fs-5 fw-bold lh-base">${(sizemoney * quantity) + 200 }元 x ${evenholiday}天 = ${((sizemoney * quantity) + 200) * evenholiday}元 (連續假日住宿費)</p>
                                    <p class="fs-5 fw-bold lh-base">${total}元 + ${((sizemoney * quantity) + 200) * evenholiday}元 = ${total + (((sizemoney * quantity) + 200) * evenholiday)}元 (${daysDiff - evenholiday}天平假日+${evenholiday}天連假日)</p>
                                `
                            } else {
                                planshtml += `
                                    <p class="fs-5 fw-bold lh-base">${(sizemoney * quantity) + 200 }元 x ${evenholiday}天 = ${((sizemoney * quantity) + 200) * evenholiday}元 (連續假日住宿費)</p>
                                `
                                totaltxt += `${daysDiff}天住宿`
                            }
                        }
                        total = total + ((sizemoney * quantity) + 200) * evenholiday
                        break
                    case "strollday":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${total}元 + ${planschecked[selectedplans[h][t]] * daysDiff}元 = ${total + (planschecked[selectedplans[h][t]] * daysDiff)}元 (公園散步一日兩次)</p>`
                        total = total + (planschecked[selectedplans[h][t]] * daysDiff)
                        totaltxt += ` + 公園散步一日兩次`
                        break
                    case "dayshower":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${total}元 + ${planschecked[selectedplans[h][t]]}元 = ${total + parseInt(planschecked[selectedplans[h][t]])}元 (住宿當日洗香香)</p>`
                        total = total + parseInt(planschecked[selectedplans[h][t]])
                        totaltxt += ` + 住宿當日洗香香`
                        break
                    case "homeshower":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${total}元 + ${planschecked[selectedplans[h][t]]}元 = ${total + parseInt(planschecked[selectedplans[h][t]])}元 (回家前洗香香)</p>`
                        total = total + parseInt(planschecked[selectedplans[h][t]])
                        totaltxt += ` + 回家前洗香香`
                        break
                    case "sleep":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${total}元 + ${planschecked[selectedplans[h][t]] * daysDiff}元 = ${total + (planschecked[selectedplans[h][t]] * daysDiff)}元 (褓姆陪伴睡覺)</p>`
                        total = total + (planschecked[selectedplans[h][t]] * daysDiff)
                        totaltxt += ` + 褓姆陪伴睡覺`
                        break
                    case "medicine":
                        planshtml += `<p class="fs-5 fw-bold lh-base">${total}元 + ${planschecked[selectedplans[h][t]] * daysDiff}天 = ${total + (planschecked[selectedplans[h][t]] * daysDiff)}元 (用藥)</p>`
                        total = total + (planschecked[selectedplans[h][t]] * daysDiff)
                        totaltxt += ` + 用藥`
                        break
                    default:
                        $(".modal-p").text(
                            "方案計算失敗！！方案計算功能壞掉請call老二瑞君！！"
                        );
                        myModal.show();
                        break
                }
            }

            planshtml += `
                <p class="fs-5 fw-bold lh-base">${total}元 可使用${parseInt(total/800)}張100元 (折價劵)</p>
                <p class="word_red fs-5 fw-bold lh-base">${total}元 - ${parseInt(total/800)*100}元 = ${total - (parseInt(total/800)*100)}元 (${totaltxt})</p>
            `
        }
        // 日期 & 姓名 & 方案 檢查
        let daychecked = false
        if($(".holidayN").is(":checked")){
            if($(".evenholiday").val() === "0" || $(".evenholiday").val() === ""){
                daychecked = false
            } else {
                daychecked = true
            }
        } else {
            daychecked = true
        }
        if (
            $("#start").val() !== "" &&
            $("#end").val() !== "" &&
            $(".name").val() !== "" &&
            $(".quantity").val() !== "" &&
            $(".quantity").val() !== "0" &&
            $(".fm_plan input[type='checkbox']:checked").length !== 0 &&
            daychecked
        ) {
            if(daysDiff - evenholiday >= 0){
                $(".word").fadeIn();
                // 彈跳視窗
                $(".word_box").append(`
                    <div class="word_boxwindow">
                        <h1 class="fs-1 fw-bold lh-base my-3  word_green">"${name}" ${getStartMonth}月住宿</h1>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            哈囉～午安 👽<br>
                            我是LINE 與你接待的 <span class="word_brown">凱凱</span><br>
                            感謝你們信任<span class="word_brown">＂毛寓所＂ 👽</span><br>
                            <span class="word_green">"${name}" 預計入住日期為</span><br>
                            <span class="word_green">${getStartMonth}/${getStartDay}~${getEndMonth}/${getEndDay}，預計是 ${daysDiff} 天</span><br>
                            凱已幫你算好費用相關囉
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_brown">"毛寓所"採開放式活動空間,所以每位住宿前都必須洗香香歐</span><br>
                            <span class="word_brown">"${name}" 可預約 '住宿當日洗香香'</span><br>
                            <span class="word_red">👽 強烈建議 👽</span><br>
                            <span class="word_brown">"${name}" 回家前洗香香,這樣 "${name}" 才會蘇胡歐</span><br>
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_green">
                                👽 "${name}" = ${quantity}隻${sizeval}住宿 ${sizemoney * quantity}/日<br>
                                ${getStartMonth}/${getStartDay}~${getEndMonth}/${getEndDay} = ${daysDiff}天 (${holidaychecked})<br>
                                ${examplehtml}
                            </span>
                        </p>
                        
                        ${planshtml}

                        <br>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_brown">"${name}" 入住 必備物品：</span><br>
                            "${name}" 家人的身分證影本1份,疫苗本,緊急連絡人電話<br>
                            "${name}" 平日飼料,鮮食,罐罐,營養品使用方式<br>
                            "${name}" 外出胸背帶,牽繩
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_brown">"${name}" 入住 選備物品：</span><br>
                            "${name}" 食碗,水碗,睡墊,毯毯,玩具<br>
                            (若選備物品未提供,"毛寓所"將會提供)
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_brown">👽 "毛寓所" 住宿 服務內容：</span><br>
                            "基本面" 餵食,玩耍,陪伴,安全<br>
                            "個別面" 每日 2pm ,9pm<br>
                            &emsp;&emsp;&emsp;&emsp; Line 記事本彙報:便尿,精神,食慾<br>
                            &emsp;&emsp;&emsp;&emsp; 照片10-20張,不定時小短影片
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            👽 "毛寓所" 入住 時間   10：00~20：00<br>
                            👽 "毛寓所" 退宿 時間   10：00~23：00<br>
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (21-23 時段需特別預約)
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            👽 說明一下，我們住宿是24H制, 例如：<br>
                            6/1  17：00入住<br>
                            6/2  19：00退宿<br>
                            超時的兩小時以安親費計價<br>
                            "${name}" 超時的安親費為 140元
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            <span class="word_brown">👽 "${name}" 入住當日收取"全額費用"</span><br>
                            <span class="word_brown">&emsp;&emsp;&emsp;(退宿超時依安親收費)</span>
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            👽 以上為"${name}"住宿規劃<br>
                            <span class="word_red">"${name}" 入住時間點區間 👽</span><br>
                            <span class="word_red">"${name}" ${englishlistp} 方案 👽</span><br>
                            "${name}" 可能產生其他費用為：<br>
                            &emsp;&emsp;&ensp;褓姆陪伴睡覺 100 ~ ${
                                planschecked["sleep"] * daysDiff
                            }元
                        </p>
                        <p class="fs-5 fw-bold lh-base mb-3">
                            👽 若有其他需求或疑問,也可提出討論 ^_^
                        </p>
                    </div>
                    <div class="d-flex justify-content-between mt-3 w-100">
                        <button type="button" class="btn btn-primary btn-lg word_sure w-100">確定</button>
                        <button class="btn btn-success btn-lg word_copy w-100 ms-3">複製</button>
                        <button class="btn btn-danger btn-lg word_picture w-100 ms-3">下載</button>
                    </div>
                `);
                // 彈跳視窗
            } else {
                $(".modal-p").text("入住天數 - 連假天數 為負 老二！！");
                myModal.show();
            }
        } else {
            $(".modal-p").text("日期 & 姓名 & 方案 & 數量 & 連假天數 有資料有錯！！");
            myModal.show();
        }
    });

    // 方案選項陣列搭配生成
    function generateSubsets(arr, length) {
        // 長度為0
        if (length === 0) {
          return [[]];
        }
        // 鎮列為0
        if (arr.length === 0) {
          return [];
        }
      
        let subsets = [];

        // 第一個陣列
        let first = arr[0];

        // 剩餘的陣列
        let rest = arr.slice(1);
        
        //將first填加到每個陣列裡
        let shorterSubsets = generateSubsets(rest, length - 1);
        shorterSubsets.forEach(function (subset) {
          subsets.push([first].concat(subset));
        });
        //與subsets陣列合併
        let longerSubsets = generateSubsets(rest, length);
        subsets = subsets.concat(longerSubsets);
      
        return subsets;
    }
});
