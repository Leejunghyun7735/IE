from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
app = Flask(__name__)
 
@app.route('/')
def home():
    return render_template('index.html')

client = MongoClient('mongodb+srv://sparta:test@cluster0.q4j284y.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

# =================== 프로필사진 클릭 시 각 멤버 상세페이지로 이동 =================== 
@app.route('/<name>')
def go_detail(name):   # ex) name = jk
    html = ".html"
    target_html = name + html # ==>  jk.html
    return render_template(target_html)

# ===================== 방명록 작성 ===================== 
@app.route("/writegb", methods=["POST"])
def guestbook_post():
    nickname_receive = request.form['nickname_give']
    comment_receive = request.form['comment_give']
    member_name_receive = request.form['member_name_give']
    pw_receive = request.form['pwd_give']

    #index값 생성
    idx_list = list(db.IE9.find({},{'_id':False}))
    idx = 1
    if idx_list:
        idx = idx_list[-1]['idx']+1

    doc = {
        'idx' : idx,
        'nickname':nickname_receive,
        'comment' :comment_receive,
        'member_name' :member_name_receive,
        'pw' : pw_receive
     }
    db.IE9.insert_one(doc)
    # nickname_receive = request.form['nickname_give']
    return jsonify({'msg': '저장완료!'})



# ===================== 멤버 방명록 조회 ===================== 
@app.route("/guestbookmem", methods=["POST"])
def guestbook_get():
    member_name = request.form['member_name_give']
    all_comments = list(db.IE9.find({'member_name':member_name},{'_id':False}))
    return jsonify({'result': all_comments})  

# ===================== 전체 방명록 조회 ===================== 
@app.route("/guestbook")
def guestbook_all():
    all_comments = list(db.IE9.find({},{'_id':False}))
    return jsonify({'result': all_comments})  

# ===================== 방명록 수정 ===================== 
@app.route("/update", methods = ["GET","POST"])
def update_book():
    idx_receive = int(request.form['idx_'])
    selected_book = list(db.IE9.find({'idx' : idx_receive},{'_id':False}))
    return jsonify({'result':selected_book})   
    
@app.route("/updatepg/<id>")
def openupdate(id):
    return render_template('update.html',Resid = id)

@app.route("/saveupdate", methods=["PUT"])
def saveupdate():
    nickname_receive = request.form['up_nickname_give']
    comment_receive = request.form['up_comment_give']
    idxxstr = request.form['idxx_give']
    idxx = int(idxxstr)
    
    doc = {
        'idx' : idxx,
        'nickname' : nickname_receive,
        'comment' : comment_receive
    }
    db.IE9.update_one({'idx':idxx},{'$set': doc})

    return jsonify({'msg': '수정완료!'})

@app.route("/findname", methods =["POST"] )
def findname():
    idx = request.form['_idx_']
    int_idx = int(idx)
    mycomment = list(db.IE9.find({'idx':int_idx},{'_id':False}))
    return jsonify({'result' : mycomment})


# ===================== 방명록 삭제 ===================== 



if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)