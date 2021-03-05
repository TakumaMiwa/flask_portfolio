from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)


class Card(db.Model):
    value = db.Column(db.Integer, default=0)
    count = db.Column(db.Integer, default=0, primary_key=True)

    def to_dict(self):
        return {
            'value': int(self.value),
            'count': int(self.count),
        }
db.drop_all()
db.create_all()

class GetByList:
    def __init__(self, arr):
        self.card_list = []
        self.arr = arr

    def get_card(self):
        for item in self.arr:
            self.card_list.append(item.to_dict())
        return self.card_list


@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('index.html')


@app.route('/algoview', methods=["GET", "POST"])
def algoview():
    cards = Card.query.all()
    card_list = GetByList(cards)
    data_list = card_list.get_card()
    return render_template('algoview.html', data_list=data_list)

@app.route('/algoview/form', methods=["POST"])
def form():
    card_count = int(request.form['count'])
    card_value = int(request.form['value'])
    new_card = Card(value=card_value, count=card_count)
    db.session.add(new_card)
    db.session.commit()
    return 'True'

@app.route('/algoview/data')
def data():
    cards = Card.query.all()
    card_list = GetByList(cards)
    data_list = card_list.get_card()
    print(data_list)
    return jsonify(data_list)


if __name__ == '__main__':
    app.run()
