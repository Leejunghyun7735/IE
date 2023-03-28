

// 프로필사진 클릭 시 각 멤버 상세페이지로 이동 (팝업으로 띄우기)
function go_detail_page(name) {


    //창 크기 지정
    let width = 1200;
    let height = 900;
    //pc화면기준 가운데 정렬
    let left = (window.screen.width / 2) - (width / 2);
    let top = (window.screen.height / 4);

    //윈도우 속성
    let windowStatus = 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top + ', scrollbars=yes, status=yes, resizable=yes, titlebar=yes';

    //연결하고싶은url / 무슨 아이디값을 넣을 것인가?
    const url = `${name}`;

    //등록된 url 및 window 속성 기준으로 팝업창을 연다.
    window.open(url, "hello popup", windowStatus);
}
// function go_detail_page(name) {
//     window.open(`${name}`, '_blank');
// }

 
// =================== 전체 방명록 조회 =================== 
function show_all_comment() {

    fetch('/guestbook', {})
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            $('#comment-list').empty()
            rows.forEach((a) => {
                let nickname = a['nickname']
                let comment = a['comment']
                let name = a['member_name']
                let temp_html = `
                    <div class="card" id = "home_card">
                        <div class="card-body">
                        <blockquote class="blockquote mb-0">
                        <p>To. ${name}</p>
                            <p style="font-weight: bold; font-size: 20px;">${comment}</p>
                            <footer class="blockquote-footer">${nickname}</footer>
                            </blockquote>
                        </div>
                    </div>
                `

                $('#comment-all-list').append(temp_html)
            })
        })
}


//  =================== 개인 방명록 작성 =================== 
function save_comment(name) {
    let nickname = $('#nickname').val() //문자열
    let comment = $('#comment').val()
    let pw = $('#pwds').val()

    let formData = new FormData();
    formData.append("nickname_give", nickname);
    formData.append("comment_give", comment);
    formData.append("member_name_give", name);
    formData.append("pwd_give", pw);
    // 유효성 검사
    if (nickname.trim() == '') {
        alert('닉네임을 입력해주세요.')
    } else if (comment.trim() == '') {
        alert('내용을 입력해주세요.')
    } else if (pw.trim() == '') {
        alert('비밀번호를 입력해주세요.')
    } else {
        fetch('/writegb', { method: "POST", body: formData, })
            .then((res) => res.json())
            .then((data) => {
                alert(data["msg"]);
                window.location.reload()
                opener.location.reload(); 
            });
    }
}


// =================== 개인 방명록 조회 =================== 
function show_comment(name) {
    let member_name = name
    formData = new FormData();
    formData.append("member_name_give", member_name);

    fetch('/guestbookmem', { method: "POST", body: formData, })
        .then((res) => res.json())
        .then((data) => {

            let rows = data['result']
            $('#comment-list').empty()
            // let member_name = rows['member_name']

            rows.forEach((a, index) => {
                let nickname = a['nickname']
                let comment = a['comment']
                let idx = a['idx']


                let temp_html = `
                    <div class="card">
                        <div class="card-body">
                        <blockquote class="blockquote mb-0">
                            <p style="font-weight: bold; font-size: 20px;">${comment}</p>
                            <footer class="blockquote-footer">${nickname}</footer>
                            </blockquote>
                            
                            <div class="input_pw">
                                <input type="password" class="pwform" id="pw${index}" placeholder="비밀번호를 입력하세요" maxlength="8">

                                <button class="update" onclick="select_update(${idx}, ${index})">수정</button>
                                <button class="del" onclick="select_del(${idx}, ${index})">삭제</button>
                                
                            </div>

                        </div>
                    </div>
                `
                $('#comment-list').append(temp_html)
            })
        })
}


// ======================== 수정 ========================  

// idx값 찾기
function select_update(idx, index) {
    let pwd = $("#pw" + index).val();
    $.ajax({
        type: "GET",
        url: "/guestbook",
        data: {
            'idx_give': idx
        },
        success: function (response) {
            idx_result = response.result

            for (let i = 0; i < idx_result.length; i++) {
                let gbook = idx_result[i];
                let gbook_idx = gbook.idx
                if (idx == gbook_idx) {
                    let gbook_password = gbook.pw
                    if (pwd == gbook_password) {
                        update_book(idx)
                    } else {
                        alert('비밀번호를 확인해주세요')
                    }
                }
            };
        }
    });
};


// 수정 창 띄우기
function update_book(idx) {

    let idx_selected = idx
    let id = 'updatepg/' + idx

    let formData = new FormData();

    formData.append("idx_", idx_selected);
    fetch('/update', { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {

            window.open(id,"update","width = 500, height = 500, top = 100, left = 200, location = no")

        })
}
// 수정하기
function save_updated_comment() {
    let updated_nickname = $('#updated_nickname').val() //문자열
    let updated_comment = $('#updated_comment').val()
    let element = document.getElementById('id_idx')
    let idxx = element.innerText
    let name_element = document.getElementById('myname')
    let my_name = name_element.innerText

    let formData = new FormData();
    formData.append("idxx_give", idxx);
    formData.append("up_nickname_give", updated_nickname);
    formData.append("up_comment_give", updated_comment);
    // 유효성 검사
    if (updated_nickname.trim() == '') {
        alert('닉네임을 입력해주세요.')
    } else if (updated_comment.trim() == '') {
        alert('내용을 입력해주세요.')
    } else {
        fetch('/saveupdate', { method: "PUT", body: formData, })
            .then((res) => res.json())
            .then((data) => {
                alert(data["msg"]);
                opener.opener.location.reload(); 
                window.close()
                if (my_name == '서채연') {
                    
                    opener.location.href = '/cy'
                    
                } else if (my_name == '장한울') {
                    opener.location.href = '/hw'
                } else if (my_name == '김영우') {
                    opener.location.href = '/yw'
                } else if (my_name == '이정현') {
                    opener.location.href = '/jh'
                } else if (my_name == '최진규') {
                    opener.location.href = '/jk'
                }

            });
    }
}

function findname() {
    let element = document.getElementById('id_idx')
    let idxx = element.innerText
    formData = new FormData();
    formData.append("_idx_", idxx);

    fetch('/findname', { method: "POST", body: formData, })
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            let my_rows = rows[0]
            let myname = my_rows['member_name']
            let my_name = `${myname}`
            $('#myname').append(my_name)
        })
}


// ======================== 삭제 시작 ========================  

// 삭제하기
function delete_book(idx) {
    $.ajax({
        type: "DELETE",
        url: "/delete",
        data: { 'idx_give': idx },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
            opener.location.reload(); 
        }
    });
};

// idx값 찾기
function select_del(idx, index) {
    let pwd = $("#pw" + index).val();
    $.ajax({
        type: "GET",
        url: "/guestbook",
        data: {
            'idx_give': idx
        },
        success: function (response) {
            idx_result = response.result

            for (let i = 0; i < idx_result.length; i++) {
                let gbook = idx_result[i];
                let gbook_idx = gbook.idx
                if (idx == gbook_idx) {
                    let gbook_password = gbook.pw
                    if (pwd == gbook_password) {
                        delete_book(idx)
                    } else {
                        alert('비밀번호를 확인해주세요')
                    }
                }
            };
        }
    });
};

// ======================== 삭제 끝 ========================  
