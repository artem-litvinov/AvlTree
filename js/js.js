var AvlTree = function () {

    this._root = null;
    this._size = 0;

    Object.defineProperties(this, {

        root: {

            get: function () {
                return this._root;
            },

            set: function (node) {
                this._root = node;
                if (node != null) {
                    node.parent = null;
                    node.tree = this;
                }
            }
        }
    });
};

AvlTree.prototype._compare = function (a, b) {

    a -= 0;
    b -= 0;

    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};

var Node = function (key) {

    this.key = key;

    this._left = null;
    this._right = null;
    this._parent = null;

    this.tree = null;

    var boxX = null;
    var boxY = null;

    var treeState = {
        Balanced: 1,
        LeftHeavy: 2,
        RightHeavy: 3
    };

    this.height = 1;

    Object.defineProperties(this, {

        left: {

            get: function () {
                if (this._left == null) return null;
                return this._left;
            },

            set: function (lft) {
                if (lft != null) {
                    this._left = lft;
                    this.left.parent = this;
                    this.left.tree = this.tree;
                } else {
                    this._left = null;
                }
            }
        },

        right: {

            get: function () {
                if (this._right == null) return null;
                return this._right;
            },

            set: function (rght) {
                if (rght != null) {
                    this._right = rght;
                    this.right.parent = this;
                    this.right.tree = this.tree;
                } else {
                    this._right = null;
                }
            }
        },

        parent: {

            get: function () {
                return this._parent;
            },

            set: function (prnt) {
                if (prnt != null) {
                    this._parent = prnt;
                } else {
                    this._parent = null;
                }
            }
        },

        leftHeight: {
            get: function () {
                return this.maxChildHeight(this.left);
            }
        },

        rightHeight: {
            get: function () {
                return this.maxChildHeight(this.right);
            }
        },

        state: {

            get: function () {

                if (this.leftHeight - this.rightHeight > 1) {
                    return treeState.LeftHeavy;
                }
                if (this.rightHeight - this.leftHeight > 1) {
                    return treeState.RightHeavy;
                }

                return treeState.Balanced;
            }
        },

        balanceFactor: {

            get: function () {

                return this.rightHeight - this.leftHeight;
            }
        }

    });

};

Node.prototype.maxChildHeight = function (node) {

    if (node != null) {
        return 1 + Math.max(node.maxChildHeight(node.left), node.maxChildHeight(node.right));
    }

    return 0;
};

AvlTree.prototype.balance = function () {

    if (this.root == null) {
        return;
    }

    return this._balance(this.root);
};

AvlTree.prototype._balance = function (node) {

    if (node.right != null) {
        this._balance(node.right);
    }

    if (node.left != null) {
        this._balance(node.left);
    }

    if (node.state == 3) {

        if (node.right != null && node.right.balenceFactor < 0) {

            node.leftRightRotation();
        } else {

            node.leftRotation();
        }
    } else if (node.state == 2) {

        if (node.left != null && node.left.balenceFactor > 0) {

            node.rightLeftRotation();
        } else {

            node.rightRotation();
        }
    }

};

Node.prototype.replaceRoot = function (newRoot) {

    if (this.parent != null) {
        if (this.parent.left == this) {
            this.parent.left = newRoot;
        } else if (this.parent.right == this) {
            this.parent.right = newRoot;
        }
    } else {
        this.tree.root = newRoot;
    }
    newRoot.parent = this.parent;
    this.parent = newRoot;
};

Node.prototype.leftRotation = function () {

    var newRoot = this.right;

    this.replaceRoot(newRoot);

    this.right = newRoot.left;

    newRoot.left = this;
};

Node.prototype.rightRotation = function () {

    var newRoot = this.left;

    this.replaceRoot(newRoot);

    this.left = newRoot.right;

    newRoot.right = this;
};

Node.prototype.leftRightRotation = function () {

    this.right.rightRotation();
    this.leftRotation();
};

Node.prototype.rightLeftRotation = function () {

    this.left.leftRotation();
    this.rightRotation();
};

AvlTree.prototype.drawTree = function () {

    if (this.root == null) {
        return null;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    return this._drawNode(this.root);
};

AvlTree.prototype._drawNode = function (node) {

    var boxWidth = 50;
    var boxHeight = 50;

    var lineX;
    var lineY;

    var boxContent = node.key;

    if (node.parent == null) {
        node.boxX = 600;
        node.boxY = 0;
    } else if (this._compare(node.key, node.parent.key) > 0) {

        node.boxX = node.parent.boxX + 75;
        node.boxY = node.parent.boxY + 75;

        if (this.root == node.parent) {
            node.boxX = node.parent.boxX + 300;
            node.boxY = node.parent.boxY + 100;
        }

        lineX = node.parent.boxX + 50;
        lineY = node.parent.boxY + 50;
    } else if (this._compare(node.key, node.parent.key) < 0) {

        node.boxX = node.parent.boxX - 75;
        node.boxY = node.parent.boxY + 75;

        if (this.root == node.parent) {
            node.boxX = node.parent.boxX - 300;
            node.boxY = node.parent.boxY + 100;
        }

        lineX = node.parent.boxX;
        lineY = node.parent.boxY + 50;
    }

    context.strokeRect(node.boxX, node.boxY, boxWidth, boxHeight)
    context.fillText(boxContent, node.boxX + 25, node.boxY + 25);

    if (node.parent != null) {
        context.beginPath();
        context.moveTo(lineX, lineY);
        context.lineTo(node.boxX + 25, node.boxY);
        context.stroke();
    }

    if (node.right != null) {
        this._drawNode(node.right);
    }

    if (node.left != null) {
        this._drawNode(node.left);
    }
};

AvlTree.prototype.add = function (key) {

    if (this.root == null) {
        this.root = new Node(key);
    } else {
        var node = this._add(key, this._root);
    }

    this.balance();

    this._size++;
    this.drawTree();
};

AvlTree.prototype._add = function (key, node) {

    if (node == null) {
        node = new Node(key, null);
    }

    if (this._compare(key, node.key) < 0) {
        node.left = this._add(key, node.left);
    } else if (this._compare(key, node.key) > 0) {
        node.right = this._add(key, node.right);
    } else {
        this._size--;
        return node;
    }

    return node;
};

AvlTree.prototype.get = function (key) {
    if (this.root === null) {
        return null;
    }

    return this._get(key, this.root);
};

AvlTree.prototype._get = function (key, node) {
    if (key === node.key) {
        return node;
    }

    if (this._compare(key, node.key) < 0) {
        if (!node.left) {
            return null;
        }
        return this._get(key, node.left);
    } else {
        if (!node.right) {
            return null;
        }
        return this._get(key, node.right);
    }
};

AvlTree.prototype.delete = function (key) {

    var root = this.root;
    var node = AvlTree.prototype._get(key, root);

    if (!node) {
        return alert("Введите корректное значение!");
    }

    var nodeToBalance;

    if (node.parent != null) {
        nodeToBalance = node.parent;
    } else {
        nodeToBalance = root;
    }

    this._size--;

    if (node.right == null) {

        if (node.parent == null) {
            this.root = node.left;
        } else {
            if (this._compare(node.parent.key, node.key) > 0) {
                node.parent.left = node.left;
            } else if (this._compare(node.parent.key, node.key) < 0) {
                node.parent.right = node.left;
            }
        }
        if (node.left) {
            node.left.parent = node.parent;
            node = node.left;
        }
    } else if (node.right.left == null) {

        node.right.left = node.left;

        if (node.parent == null) {
            this.root = node.right;
        } else {
            if (this._compare(node.parent.key, node.key) > 0) {
                node.parent.left = node.right;
            } else if (this._compare(node.parent.key, node.key) < 0) {
                node.parent.right = node.right;
            }
        }
    } else {

        var leftmost = node.right.left;
        var leftmostParent = leftmost.parent;

        while (leftmost.left != null) {
            leftmostParent = leftmost;
            leftmost = leftmost.left;
        }

        leftmostParent.left = leftmost.right;

        leftmost.left = node.left;
        leftmost.right = node.right;

        if (node.parent == null) {
            this.root = leftmost;
        } else {
            if (this._compare(node.parent.key, node.key) > 0) {
                node.parent.left = leftmost;
            } else if (this._compare(node.parent.key, node.key) < 0) {
                node.parent.right = leftmost;
            }
        }
    }

    this.balance(nodeToBalance);

    this.drawTree();
    return true;
};