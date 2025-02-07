---
title: 描述TCP的三次握手
tags:
  - 计算机网络
  - 面试题
date: 2024-06-03
---
# 一描述TCP的三次握手
![](http://cdn.mengyang.online/202412131618721.png)

TCP的三次握手（Three-Way Handshake）是建立TCP连接的过程中，客户端与服务器之间交换的三个特殊报文段，旨在确保双方都准备好进行可靠的双向通信。这一过程确保了连接的建立是同步的，并且双方都了解了必要的信息来开始数据传输。下面是三次握手的具体步骤：

1. **第一次握手（SYN）**:
    
    - 客户端发送一个TCP报文段到服务器，该报文段中：
        - **SYN (Synchronize)** 标志位被置为1，表示这是一个同步序列请求。
        - **Sequence Number (Seq)** 字段设置为一个随机生成的初始序列号ISN（Initial Sequence Number），用于之后的数据包排序和确认。
    - 此报文段不携带数据，但消耗一个报文段序号。
2. **第二次握手（SYN-ACK）**:
    
    - 服务器接收到客户端的SYN报文段后，回复一个确认报文段，其中：
        - **SYN** 标志位也被置为1，表示服务器同意建立连接。
        - **ACK (Acknowledgment)** 标志位被置为1，表示这是一个确认报文。
        - **Sequence Number** 字段设置为服务器选择的初始序列号ISN。
        - **Acknowledgment Number (Ack)** 字段设置为客户端ISN加1，确认收到了客户端的SYN报文。
    - 同样，此报文段也不携带数据，但消耗一个报文段序号。
3. **第三次握手（ACK）**:
    
    - 客户端接收到服务器的SYN-ACK报文段后，再发送一个确认报文段到服务器，其中：
        - **ACK** 标志位被置为1。
        - **Sequence Number** 设置为客户端ISN加1，表示这是对服务器SYN报文的确认。
        - **Acknowledgment Number** 设置为服务器ISN加1，确认收到了服务器的SYN报文段。
    - 此报文段同样可以携带数据，但至少确认了连接的建立。

经过这三次握手后，客户端和服务器都进入了ESTABLISHED状态，表示TCP连接已成功建立，双方可以开始互相发送数据。三次握手确保了双方都有对方的序列号和确认号，为可靠的数据传输奠定了基础。