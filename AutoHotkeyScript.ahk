#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

;##################################################
: Vim系
;##################################################

;矢印
sc07B & h::Send,{Left}
sc07B & j::Send,{Down}
sc07B & k::Send,{Up}
sc07B & l::Send,{Right}

;Home
sc07B & A::Send,{Home}

;End
sc07B & I::Send,{End}

;保存
sc07B & w::Send,^s

;##################################################
: その他
;##################################################


;半角/全角
sc07B & q::Send,{vkF3sc029}

;BackSpace
sc07B & o::Send,{Backspace}

;Esc
sc07B & Tab::Send,{Esc}

;変換 → Enter
sc079::Enter

;ひらがな → BackSpace
sc070::Backspace
