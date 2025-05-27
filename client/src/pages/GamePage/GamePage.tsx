import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {
    getQuestionsData,
    selectAllQuestions,
} from "../../features/questionsDataSlice.ts";
import {useEffect, useState} from "react";
import {selectFemaleGender, selectMaleGender} from "../../features/choiceGenderSlice.ts";
import {loadUser, resetUser, selectAddUserName, selectUserData} from "../../features/usersDataSlice.ts";
import {
    completeQuestion, resetGameProgress,
    saveProgress,
    selectGameCompletedQuestions,
    selectGameProgress, selectGameQuestionStatus
} from "../../features/gameProgressSlice.ts";
import './GamePage.scss'


function GamePage() {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [inputAnswerValue, setInputAnswerValue] = useState('');
    const [trueAnswer, setTrueAnswer] = useState(null);
    const [score, setScore] = useState(0)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const allQuestionsData = useAppSelector(selectAllQuestions);
    const maleGender = useAppSelector(selectMaleGender);
    const femaleGender = useAppSelector(selectFemaleGender);
    const player = useAppSelector(selectUserData);
    const completedQuestions = useAppSelector(selectGameCompletedQuestions);
    const questionStatus = useAppSelector(selectGameQuestionStatus)
    const gameProgress = useAppSelector(selectGameProgress);
    const pointsOfQuestion = selectedQuestion ? selectedQuestion.points : 0;
    const questionStatusToUse = Object.keys(player.questionStatus).length > 0 && Object.keys(player.questionStatus) > Object(questionStatus).length ?  player.questionStatus: questionStatus;

    useEffect(() => {
        dispatch(getQuestionsData());

        setScore(player.score)
        if (player && player.questionStatus) {
            const newQuestionsStatus = Object.entries(player.questionStatus);
            newQuestionsStatus.forEach(([questionId, status]) => {
                dispatch(completeQuestion({ questionId: Number(questionId), isCorrect: status === "correct", newScore: player.score }));
            });
        }
    }, [player, dispatch]);

    const exitHandler = () => {
        navigate("/");
        setScore(0);
        setSelectedQuestion(null);
        dispatch(resetGameProgress())
        dispatch(resetUser());
    }

    const handleCellClick = (question) => {
       if(gameProgress.completedQuestions.includes(question.id)) {
           return
       }
       setSelectedQuestion(question);
    };

    const updatePlayerScore = async (playerName, score, completedQuestions, questionStatus) => {
        try {
            if(player && player.name) {
                await dispatch(saveProgress({
                    playerId: player.id,
                    score: score,
                    completedQuestions: completedQuestions,
                    questionStatus: questionStatus
                }));
            } else {
                console.error("Player data is not available.");
            }
        } catch (error) {
            console.error("Ошибка при обновлении счета:", error);
        }
    }

    const checkAnswer = () => {
        const trueAnser = selectedQuestion.answer.toLowerCase();
        const enteredAnswer = inputAnswerValue.toLowerCase();
        const isCorrect = trueAnser === enteredAnswer;

        setTrueAnswer(isCorrect ? "ПРАВИЛЬНО" : "НЕ ПРАВИЛЬНО");
        if(isCorrect) {
            const newScore = score + selectedQuestion.points;
            setScore(newScore)
            dispatch(completeQuestion({ questionId: selectedQuestion.id, isCorrect, newScore }));
            updatePlayerScore(
                player.name,
                newScore,
                [...gameProgress.completedQuestions, selectedQuestion.id],
                {
                    ...gameProgress.questionStatus,
                    [selectedQuestion.id]: isCorrect ? "correct" : "wrong"
                }
            )
        } else if (!isCorrect) {
            const newScore = gameProgress.score
            dispatch(completeQuestion({ questionId: selectedQuestion.id, isCorrect , newScore}));
            updatePlayerScore(
                player.name,
                newScore,
                [...gameProgress.completedQuestions, selectedQuestion.id],
                {
                    ...gameProgress.questionStatus,
                    [selectedQuestion.id]: isCorrect ? "correct" : "wrong"
                }
            )
        }

        setTimeout(() => {
            setSelectedQuestion(null);
            setTrueAnswer(null);
            setInputAnswerValue('');
        }, 2000)
    }

    return (
        <>
            <div className={"main_container"}>
                <div className={"main_container__topLine"}>
                    <div className={"main_container__topLine__score"}>Баллы: {score}</div>
                    <button
                        onClick={exitHandler}
                        className={"main_container__topLine__exit"}>ВЫХОД</button>
                </div>
                {selectedQuestion && (
                    <>
                    <div className="modal-overlay" onClick={() => setSelectedQuestion(null)}></div>
                    <div className={"main_container__question"}>
            <div>{selectedQuestion.text}</div>
                        {trueAnswer === null ? (
                            <div>
                                <input
                                    onChange={(event) => setInputAnswerValue(event.target.value)}
                                    className={"main_container__question__input-answer"}
                                    type="text" placeholder={'Ответ...'}/>
                                <button
                                    className={"main_container__question__button-answer"}
                                    onClick={checkAnswer}
                                >OK
                                </button>
                            </div>
                        ) : (
                            <div className={trueAnswer === "ПРАВИЛЬНО" ? "main_container__question__result-true": "main_container__question__result-false"}>
                                {trueAnswer}
                            </div>
                        )}
                    </div>
                    </>
                )}

                <div className={"main_container__game-table"}>
                    <div className={"main_container__game-table__header"}>
                        {
                            allQuestionsData && allQuestionsData.length > 0 ? (
                                [...new Set(allQuestionsData.map((item) => item.category))].map((item, index) => (
                                    <div
                                        key={index}
                                        className={"main_container__game-table__header__category"}>
                                    {item}
                                </div>
                            ))) : <div>LOADING</div>}
                    </div>
                    <div className={"table-body"}>
                        {allQuestionsData && allQuestionsData.length > 0 ? (
                            allQuestionsData.map((item, index) =>(
                            <div key={index} className={"table-row"}>
                                <div
                                    onClick={() => handleCellClick(item)}
                                    className={`table-cell 
                                    ${selectedQuestion?.id === item.id ? "active" : ""}
                                    ${gameProgress.completedQuestions.includes(item.id) ?
                                        questionStatusToUse[item.id]  === "correct" ? "answered-correct" : "answered-wrong" : ""}`}>
                                    {item.points}
                                </div>
                            </div>
                        ))
                        ): (
                            <div>NO DATA</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GamePage